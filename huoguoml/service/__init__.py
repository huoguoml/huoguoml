import importlib
import os

import requests
import uvicorn
from fastapi import Depends, FastAPI

from huoguoml.constants import HUOGUOML_METADATA_FILE
from huoguoml.schemas.run import Run
from huoguoml.schemas.ml_service import MLService
from huoguoml.utils.utils import read_json, download_and_extract_run_files


def concat_uri(*args):
    uri = ""
    for arg in args:
        uri += arg
        if not uri.endswith("/"):
            uri += "/"
    return uri


def register_ml_service(register_api: str, service_host: str, service_port: int) -> MLService:
    ml_service = MLService(host=service_host, port=service_port)
    response = requests.post(register_api, json=ml_service.dict(exclude_unset=True))
    return MLService.parse_raw(response.text)


class MLModel(object):

    def __init__(self, model, version):
        self._update(model=model, version=version)

    def _update(self, model, version):
        self.model = model
        self.version = version


ML_MODEL = MLModel(None, None)


def load_model(model_dir):
    os.chdir(model_dir)
    run_json = read_json(HUOGUOML_METADATA_FILE)
    run = Run.parse_raw(run_json)

    module_name = 'huoguoml.tracking.{}'.format(run.model_definition.model_api.module)
    module = importlib.import_module(module_name)
    function = getattr(module, run.model_definition.model_api.name)

    model = function(**run.model_definition.model_api.arguments)

    ML_MODEL._update(model=model, version=run.dict())


def get_ml_model() -> MLModel:
    return ML_MODEL


def start_huoguoml_service(host: str, port: int, server_uri: str, artifact_dir: str):
    """
    Starts the HuoguoML service

    Args:
        server_uri: The URI to the HuoguoML server
        host: The network address to listen on
        port: The port to listen on
        artifact_dir: Location of the artifact directory
    """
    global ML_MODEL

    # TODO: Register model
    # TODO: Check if register model is available in artifact_dir, otherwise download
    # TODO: Launch service with model
    register_ml_service(register_api=concat_uri(server_uri, "api", "v1", "ml_services"),
                        service_host=host,
                        service_port=port)
    app = FastAPI()

    @app.post("/api/v1/models", response_model=MLService)
    async def update_model(ml_service: MLService):
        source_dir = os.getcwd()
        run_dir = os.path.join(artifact_dir, ml_service.run_id)
        if not os.path.isdir(run_dir):
            os.makedirs(run_dir)
            uri = concat_uri(server_uri, "api", "v1", "runs", ml_service.run_id)
            download_and_extract_run_files(run_uri=uri, dst_dir=run_dir)
        load_model(model_dir=run_dir)
        os.chdir(source_dir)

    @app.post("/api/v1/predict")
    async def predict(data, ml_model=Depends(get_ml_model)):
        if ml_model.model:
            return ml_model.model.predict(data)
        return None

    @app.get("/api/v1/version", response_model=Run)
    async def version(ml_model=Depends(get_ml_model)):
        return ml_model.version

    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_service(host="127.0.0.1", port=5000,
                           server_uri="http://localhost:8080",
                           artifact_dir="../../examples/huoguoml_service")

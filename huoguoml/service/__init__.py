import importlib
import os

import requests
import uvicorn
from fastapi import FastAPI
from pydantic import create_model

from huoguoml.constants import HUOGUOML_METADATA_FILE
from huoguoml.schemas import Run, MLService
from huoguoml.utils import read_json, download_and_extract_run_files


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


def start_huoguoml_service(host: str, port: int, server_uri: str, artifact_dir: str):
    """
    Starts the HuoguoML service

    Args:
        server_uri: The URI to the HuoguoML server
        host: The network address to listen on
        port: The port to listen on
        artifact_dir: Location of the artifact directory
    """
    # TODO: Check if server is online otherwise raise error
    # TODO: Register model
    # TODO: Check if register model is available in artifact_dir, otherwise download
    # TODO: Launch service with model
    register_api = concat_uri(server_uri, "rest", "ml_services")
    ml_service = register_ml_service(register_api=register_api,
                                     service_host=host,
                                     service_port=port)
    app = FastAPI()

    if ml_service.run_id:
        run_dir = os.path.join(artifact_dir, ml_service.run_id)
        if not os.path.isdir(run_dir):
            os.makedirs(run_dir)
            uri = concat_uri(server_uri, "rest", "runs", ml_service.run_id)
            download_and_extract_run_files(run_uri=uri, dst_dir=run_dir)

        os.chdir(run_dir)
        run_json = read_json(HUOGUOML_METADATA_FILE)
        run = Run.parse_raw(run_json)
        input_model = create_model('Inputs', **run.model_definition.model_graph.inputs)
        output_model = create_model('Outputs', **run.model_definition.model_graph.outputs)

        module_name = 'huoguoml.tracking.{}'.format(run.model_definition.model_api.module)
        module = importlib.import_module(module_name)
        function = getattr(module, run.model_definition.model_api.name)

        model = function(**run.model_definition.model_api.arguments)

        @app.post("/rest/models/{}/predict".format(run.experiment_name),
                  response_model=output_model)
        async def predict(data: input_model):
            return model.predict(data)

        @app.get("/rest/models/{}/version".format(run.experiment_name), response_model=Run)
        async def version():
            return run

    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_service(host="127.0.0.1", port=5000,
                           server_uri="http://localhost:8080",
                           artifact_dir="../../examples/huoguoml_service")

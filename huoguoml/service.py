import importlib
import os

import uvicorn
from fastapi import FastAPI
from pydantic import create_model

from huoguoml.constants import HUOGUOML_METADATA_FILE
from huoguoml.schemas import Run
from huoguoml.utils import read_json, download_and_extract_run_files


def start_huoguoml_service(host: str, port: int, run_uri: str, artifact_dir: str):
    """
    Starts the HuoguoML service

    Args:
        host: The network address to listen on
        port: The port to listen on
        run_uri: URI to the run artifact
        artifact_dir: Location of the artifact directory
    """
    # TODO: Check if run_uri is correct and raise error otherwise
    run_id = os.path.basename(run_uri)
    run_dir = os.path.join(artifact_dir, run_id)
    if not os.path.isdir(run_dir):
        os.makedirs(run_dir)
        download_and_extract_run_files(run_uri=run_uri, dst_dir=run_dir)

    os.chdir(run_dir)
    run_json = read_json(HUOGUOML_METADATA_FILE)
    # TODO: Check if exist otherwise error
    run = Run.parse_raw(run_json)
    input_model = create_model('Inputs', **run.model_definition.model_graph.inputs)
    output_model = create_model('Outputs', **run.model_definition.model_graph.outputs)

    module_name = 'huoguoml.tracking.{}'.format(run.model_definition.model_api.module)
    module = importlib.import_module(module_name)
    function = getattr(module, run.model_definition.model_api.name)

    model = function(**run.model_definition.model_api.arguments)

    app = FastAPI()

    # TODO: Load model for prediction
    @app.post("/rest/{}/{}/predict".format(run.experiment_name,
                                           run.run_nr),
              response_model=output_model)
    async def predict(data: input_model):
        return model.predict(data)

    @app.get("/rest/{}/{}/version".format(run.experiment_name,
                                          run.run_nr))
    async def version():
        return run.id

    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_service(host="127.0.0.1", port=5000,
                           run_uri="http://localhost:8080/rest/runs/e239b6a9233d7dacbc568048016dc210",
                           artifact_dir="../../examples/huoguoml_service")

import importlib
import os

import uvicorn
from fastapi import FastAPI
from pydantic import create_model

from huoguoml.constants import HUOGUOML_METADATA_FILE
from huoguoml.schemas import Run
from huoguoml.utils import read_json


def start_huoguoml_service(host: str, port: int, artifact_dir):
    os.chdir(artifact_dir)
    run_json = read_json(HUOGUOML_METADATA_FILE)
    # TODO: Check if exist otherwise error
    run = Run.parse_raw(run_json)
    # TODO: Check if exist otherwise error
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

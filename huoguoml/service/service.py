import os
from typing import List

import uvicorn
import yaml
from fastapi import FastAPI
from pydantic import create_model


def _read_yaml(yaml_path):
    with open(yaml_path, 'r') as stream:
        try:
            config = yaml.safe_load(stream)
            return config
        except yaml.YAMLError as exc:
            raise exc


def _create_service(artifact_dir, model_name="tracking"):
    config = _read_yaml(os.path.join(artifact_dir, "config.yaml"))
    # Inputs
    fields = {}
    for name, spec in config["signature"]["inputs"].items():
        fields[name] = (List, None)
    input_model = create_model('Inputs', **fields)

    # Outputs
    fields = {}
    for name, spec in config["signature"]["outputs"].items():
        fields[name] = (List, None)
    output_model = create_model('Outputs', **fields)

    app = FastAPI()

    @app.post("/models/{}/predict".format(model_name), response_model=output_model)
    async def predict(data: input_model):
        return {"message": "Hello World"}

    uvicorn.run(app, host="0.0.0.0", port=8000)
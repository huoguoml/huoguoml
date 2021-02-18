import os
from typing import List

import uvicorn
from fastapi import FastAPI
from pydantic import create_model

from huoguoml.constants import HUOGUOML_METADATA_FILE
from huoguoml.utils import read_json


def start_huoguoml_service(artifact_dir, model_name="tracking"):
    config = read_json(os.path.join(artifact_dir, HUOGUOML_METADATA_FILE))
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

    @app.post("/types/{}/predict".format(model_name), response_model=output_model)
    async def predict(data: input_model):
        return {"message": "Hello World"}

    uvicorn.run(app, host="0.0.0.0", port=8000)

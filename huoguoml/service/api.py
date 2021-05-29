import os
import shutil

import requests
from fastapi import APIRouter

from huoguoml.constants import HUOGUOML_METADATA_FILE, HUOGUOML_DEFAULT_FOLDER
from huoguoml.schemas.ml_service import MLServiceIn, MLService
from huoguoml.schemas.run import Run
from huoguoml.util.utils import concat_uri, download_and_extract_run_files, load_run_model, read_yaml


class HuoguoMLRouter(object):

    def __init__(self, ml_service_in: MLServiceIn, artifact_dir: str, server_uri: str):
        router = APIRouter(
            prefix="/api",
        )

        register_api = concat_uri(server_uri, "api", "services")
        response = requests.put(register_api, json=ml_service_in.dict())
        self.ml_service = MLService.parse_raw(response.text)
        self.artifact_dir = artifact_dir
        self.server_uri = server_uri

        # TODO: Check if register model is available in artifact_dir, otherwise download
        self._update(ml_service=self.ml_service)

        @router.post("/update", response_model=MLService)
        async def update_model(ml_service: MLService):
            self._update(ml_service)

        @router.post("/predict")
        async def predict(data):
            if self.model:
                return self.model.predict(data)

        @router.get("/version", response_model=MLService)
        async def version():
            return self.ml_service

        self.router = router

    def _update(self, ml_service: MLService):
        self.ml_service = ml_service

        source_dir = os.getcwd()
        model_url = concat_uri(self.server_uri, "api", "models", ml_service.model_name, ml_service.model_version)
        model_dir = os.path.join(HUOGUOML_DEFAULT_FOLDER)

        if os.path.isdir(model_dir):
            shutil.rmtree(model_dir)
        download_and_extract_run_files(run_uri=model_url, dst_dir=model_dir)

        run_dict = read_yaml(os.path.join(model_dir, HUOGUOML_METADATA_FILE))
        run = Run(**run_dict)

        os.chdir(model_dir)
        self.model = load_run_model(run=run)
        os.chdir(source_dir)

import importlib
import os
import shutil
from typing import List, Any

from fastapi import APIRouter
from pydantic import create_model

from huoguoml.constants import HUOGUOML_METADATA_FILE, HUOGUOML_DEFAULT_FOLDER
from huoguoml.schema.ml_service import MLService
from huoguoml.schema.run import Run
from huoguoml.util.string import concat_uri
from huoguoml.util.yaml import read_yaml
from huoguoml.util.zip import download_and_extract_zip_file


def load_run_model(run: Run):
    module_name = 'huoguoml.tracking.{}'.format(run.model_definition.model_api.module)
    module = importlib.import_module(module_name)
    function = getattr(module, run.model_definition.model_api.name)
    return function(**run.model_definition.model_api.arguments)


class HuoguoMLRouter(APIRouter):
    output_model = None
    input_model = None

    def __init__(self, ml_service: MLService, artifact_dir: str, server_uri: str, **extra: Any):
        super().__init__(**extra)
        self.artifact_dir = artifact_dir
        self.server_uri = server_uri
        self.ml_service = ml_service

        # TODO: Check if register model is available in artifact_dir, otherwise download
        self._update()

        @self.post("/update", response_model=MLService)
        async def update_model(updated_ml_service: MLService):
            self.ml_service = updated_ml_service
            self._update()

        @self.post("/predict", response_model=HuoguoMLRouter.output_model)
        async def predict(data: HuoguoMLRouter.input_model):
            return self.model.predict(data)

        @self.get("/version", response_model=MLService)
        async def version():
            return self.ml_service

    def _update(self):
        source_dir = os.getcwd()
        model_url = concat_uri(self.server_uri, "api", "models", self.ml_service.model_name,
                               self.ml_service.model_version)
        model_dir = os.path.join(self.artifact_dir, HUOGUOML_DEFAULT_FOLDER, self.ml_service.model_version)

        if os.path.isdir(model_dir):
            shutil.rmtree(model_dir)
        download_and_extract_zip_file(zip_uri=model_url, dst_dir=model_dir)

        run_dict = read_yaml(os.path.join(model_dir, HUOGUOML_METADATA_FILE))
        run = Run(**run_dict)

        input_model_type = {}
        for input_name, _ in run.model_definition.model_graph.inputs.items():
            input_model_type[input_name] = (List, [])
        HuoguoMLRouter.input_model = create_model('Inputs', **input_model_type)

        output_model_type = {}
        for output_name, _ in run.model_definition.model_graph.outputs.items():
            output_model_type[output_name] = (List, [])
        HuoguoMLRouter.output_model = create_model('Outputs', **output_model_type)

        os.chdir(model_dir)
        self.model = load_run_model(run=run)
        os.chdir(source_dir)

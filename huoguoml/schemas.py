"""
The huoguoml.types module contains all types used throughout the package
"""
import os
import time
from typing import Dict, Any, Union, Optional
from typing import List

from pydantic import BaseModel

from huoguoml.constants import HUOGUOML_METADATA_FILE
from huoguoml.utils import save_json


class ModelNode(BaseModel):
    """Model Node
    """
    dtype: str
    shape: List[Union[int, None]]


class ModelGraph(BaseModel):
    """Type for a model. Every model consists of a input/output
    node with a certain shape and dtype.
    """
    inputs: Dict[str, ModelNode]
    outputs: Dict[str, ModelNode]


class ModelAPI(BaseModel):
    """Type for the model tracking API.
    """
    module: str
    name: str
    arguments: Dict[str, Any]


class ModelDefinition(BaseModel):
    """Type for the definition of a model"""
    model_graph: ModelGraph
    model_api: ModelAPI
    requirements: List[str]


class Run(BaseModel):
    """Type for a single experiment Run
    """
    id: str
    run_nr: int
    creation_time: float
    finish_time: float = 0
    experiment_name: str
    run_dir: str = ""

    parameters: Dict[str, str] = {}
    metrics: Dict[str, str] = {}
    tags: Dict[str, str] = {}
    model_definition: Optional[ModelDefinition]

    class Config:
        orm_mode = True

    def log_model(self,
                  model_type: str,
                  **kwargs):
        if self.model_definition:
            raise FileExistsError("A model already exists")

        if model_type == "tensorflow":
            from huoguoml.tracking.tensorflow import log_model
            log_model(run=self, **kwargs)

    def log_parameter(self, parameter_name: str, parameter_value: str):
        self.parameters[parameter_name] = parameter_value

    def log_metric(self, metric_name: str, metric_value: str):
        self.metrics[metric_name] = metric_value

    def log_tag(self, tag_name: str, tag_value: str):
        self.tags[tag_name] = tag_value

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.finish_time = time.time()
        run_json_path = os.path.join(self.run_dir, HUOGUOML_METADATA_FILE)
        save_json(json_path=run_json_path, data=self.json())


class Experiment(BaseModel):
    """Type for a experiment
    """
    id: int
    name: str
    runs: List[Run]

    class Config:
        orm_mode = True

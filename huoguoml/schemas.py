"""
The huoguoml.types module contains all types used throughout the package
"""
from typing import Dict, Any, Union
from typing import List

from pydantic import BaseModel


class ModelNode(BaseModel):
    """Model Node
    """
    dtype: str
    shape: List[Union[int, None]]


class ModelDefinition(BaseModel):
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


class Run(BaseModel):
    """Type for a single experiment Run
    """
    id: int
    creation_time: float
    experiment_name: str

    class Config:
        orm_mode = True


class RunDetail(Run):
    """Type for a single experiment Run details
    """
    model_definition: ModelDefinition
    model_api: ModelAPI
    requirements: List[str]


class Experiment(BaseModel):
    """Type for a experiment
    """
    id: int
    name: str

    class Config:
        orm_mode = True


class ExperimentDetail(Experiment):
    """Type for the details of a experiment"""
    runs: List[Run]

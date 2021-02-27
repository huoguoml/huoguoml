"""
The huoguoml.types module contains all types used throughout the package
"""
from typing import Dict, Any, Union, Optional
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
    run_nr: int
    creation_time: float
    experiment_name: str

    model_definition: Optional[ModelDefinition]
    model_api: Optional[ModelAPI]
    requirements: Optional[List[str]]

    class Config:
        orm_mode = True


class Experiment(BaseModel):
    """Type for a experiment
    """
    id: int
    name: str
    runs: List[Run]

    class Config:
        orm_mode = True

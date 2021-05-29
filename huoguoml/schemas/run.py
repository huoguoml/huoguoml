from enum import IntEnum
from typing import Optional, List, Dict, Any, Union

from pydantic import BaseModel, constr

from huoguoml.schemas.ml_model import MLModel


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


class RunStatus(IntEnum):
    completed = 1
    failed = 0
    pending = -1


class RunIn(BaseModel):
    experiment_name: constr(to_lower=True)
    author: str
    status: int = RunStatus.pending.value


class Run(RunIn):
    """Type for a single experiment Run
    """
    id: int
    run_nr: int

    creation_time: float
    finish_time: float
    duration: float

    description: str

    parameters: Dict[str, str]
    metrics: Dict[str, str]
    tags: Dict[str, str]
    model_definition: Optional[ModelDefinition]

    ml_model: Optional[MLModel]

    class Config:
        orm_mode = True

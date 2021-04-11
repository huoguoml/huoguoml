import time
from enum import IntEnum
from typing import Optional, List, Dict, Any, Union

from pydantic import BaseModel


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
    experiment_name: str
    author: str
    status: RunStatus = RunStatus.pending


class Run(RunIn):
    """Type for a single experiment Run
    """
    id: str
    run_nr: int
    creation_time: float
    finish_time: Optional[float] = None
    duration: Optional[float] = None

    description: Optional[str] = None

    parameters: Optional[Dict[str, str]] = None
    metrics: Optional[Dict[str, str]] = None
    tags: Optional[Dict[str, str]] = None
    model_definition: Optional[ModelDefinition] = None

    class Config:
        orm_mode = True

    def end_experiment_run(self, failed):
        self.finish_time = time.time()
        self.duration = self.finish_time - self.creation_time

        if failed:
            self.status = RunStatus.failed
        else:
            self.status = RunStatus.completed

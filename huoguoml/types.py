"""
The huoguoml.types module contains all types used throughout the package
"""
import time
from typing import Dict, Any, Union
from typing import List

from pydantic import BaseModel
from pydantic import Field


class RequestSpecification(BaseModel):
    """Request specification
    """
    dtype: str
    shape: List[Union[int, None]]


class Request(BaseModel):
    """Type for a request. Every request consists of a input/output
    with a certain shape and dtype.
    """
    inputs: Dict[str, RequestSpecification]
    outputs: Dict[str, RequestSpecification]


class Tracking(BaseModel):
    """Type for the tracking API.
    """
    module: str
    name: str
    arguments: Dict[str, Any]


class Run(BaseModel):
    """Type for a single experiment Run
    """
    id: str
    creation_timestamp: float = Field(default_factory=time.time)
    request: Request
    tracking: Tracking
    requirements: List[str]


class Experiment(BaseModel):
    """Type for a experiment
    """
    id: int
    name: str


class Experiments(BaseModel):
    """Type representing a list of experiments
    """
    experiments: List[Experiment] = []

    def add_experiment(self, experiment: Experiment):
        """Add experiment to list
        """
        self.experiments.append(experiment)

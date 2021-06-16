from enum import IntEnum
from typing import List

from pydantic import BaseModel, constr


class MLModelTag(IntEnum):
    archived = 2
    production = 1
    staging = 0
    none = -1


class MLModelIn(BaseModel):
    name: constr(to_lower=True)
    run_id: int


class MLModel(BaseModel):
    run_id: int
    version: str
    name: str
    tag: int
    creation_time: float
    last_modification: float

    class Config:
        orm_mode = True


class MLModelRegistry(BaseModel):
    name: constr(to_lower=True)
    ml_models: List[MLModel]

    class Config:
        orm_mode = True

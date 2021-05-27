from enum import IntEnum
from typing import List, Optional

from pydantic import BaseModel, constr


class MLModelTag(IntEnum):
    production = 1
    staging = 0


class MLModelIn(BaseModel):
    name: constr(to_lower=True)
    run_id: int


class MLModel(BaseModel):
    run_id: int
    version: str
    tag: Optional[int]

    class Config:
        orm_mode = True


class MLModelRegistry(BaseModel):
    name: constr(to_lower=True)
    ml_models: List[MLModel]

    class Config:
        orm_mode = True

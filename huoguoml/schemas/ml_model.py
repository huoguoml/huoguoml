from enum import IntEnum
from typing import Optional, List

from pydantic import BaseModel, constr

from huoguoml.schemas.run import Run


class MLModelTag(IntEnum):
    production = 1
    staging = 0


class MLModelIn(BaseModel):
    name: constr(to_lower=True)
    run_id: int


class MLModel(BaseModel):
    name: constr(to_lower=True)
    tag: Optional[int]
    run: Run

    class Config:
        orm_mode = True


class MLModelRegistry(BaseModel):
    name: constr(to_lower=True)
    ml_models: List[MLModel]

    class Config:
        orm_mode = True

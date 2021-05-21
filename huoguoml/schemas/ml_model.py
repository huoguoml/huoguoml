from typing import List

from pydantic import BaseModel, constr

from huoguoml.schemas.run import Run


class MLModelIn(BaseModel):
    name: constr(to_lower=True)
    run_id: int


class MLModel(BaseModel):
    name: constr(to_lower=True)
    run: Run

    class Config:
        orm_mode = True

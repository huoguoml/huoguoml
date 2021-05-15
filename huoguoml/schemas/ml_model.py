from typing import List, Optional

from pydantic import BaseModel, constr

from huoguoml.schemas.run import Run


class MLModelIn(BaseModel):
    name: constr(to_lower=True)
    run: Optional[Run]


class MLModel(BaseModel):
    id: int
    name: constr(to_lower=True)
    runs: List[Run]

    class Config:
        orm_mode = True

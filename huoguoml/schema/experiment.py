from typing import List

from pydantic import BaseModel, constr

from huoguoml.schema.run import Run


class Experiment(BaseModel):
    """Type for a experiment
    """
    id: int
    name: constr(to_lower=True)
    description: str
    runs: List[Run]

    class Config:
        orm_mode = True

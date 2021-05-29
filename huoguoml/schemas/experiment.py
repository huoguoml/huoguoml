from typing import List

from pydantic import BaseModel, constr

from huoguoml.schemas.run import Run


class ExperimentIn(BaseModel):
    name: constr(to_lower=True)


class Experiment(ExperimentIn):
    """Type for a experiment
    """
    id: int
    description: str
    runs: List[Run]

    class Config:
        orm_mode = True
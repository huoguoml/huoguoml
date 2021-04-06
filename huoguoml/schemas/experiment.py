from typing import Optional, List

from pydantic import BaseModel

from huoguoml.schemas.run import Run


class ExperimentIn(BaseModel):
    name: str


class Experiment(ExperimentIn):
    """Type for a experiment
    """
    id: int
    description: Optional[str] = None
    runs: List[Run]

    class Config:
        orm_mode = True

from typing import List

from fastapi import APIRouter

from huoguoml.schemas import Experiment, ExperimentDetail, RunDetail
from huoguoml.server.database.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/rest/experiments",
        tags=["experiments"],
        responses={404: {"description": "Not found"}},
    )

    @router.get("/", response_model=List[Experiment])
    async def get_experiments():
        return service.get_experiments()

    @router.get("/{run_id}", response_model=ExperimentDetail)
    async def get_experiment(run_id: int):
        return service.get_experiment(run_id=run_id)

    return router

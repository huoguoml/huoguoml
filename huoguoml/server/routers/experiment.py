from typing import List

from fastapi import APIRouter

from huoguoml.schemas import Experiment
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

    @router.get("/{experiment_id}", response_model=Experiment)
    async def get_experiment(experiment_id: int):
        return service.get_experiment(experiment_id=experiment_id)

    return router

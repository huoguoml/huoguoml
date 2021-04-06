from typing import List

from fastapi import APIRouter

from huoguoml.schemas.experiment import Experiment
from huoguoml.schemas.run import Run
from huoguoml.server.db.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/api/v1/experiments",
        tags=["experiments"],
    )

    @router.get("", response_model=List[Experiment])
    async def get_experiments():
        return service.get_experiments()

    @router.post("", response_model=Experiment)
    async def create_experiment(experiment: Experiment):
        return service.create_experiment(experiment=experiment)

    @router.get("/{experiment_name}", response_model=Experiment)
    async def get_experiment(experiment_name: str):
        return service.get_experiment(experiment_name=experiment_name)

    @router.get("/{experiment_name}/{experiment_run_nr}", response_model=Run)
    async def get_experiment_run(experiment_name: str, experiment_run_nr: int):
        return service.get_experiment_run(experiment_name=experiment_name,
                                          experiment_run_nr=experiment_run_nr)

    @router.patch("/{experiment_name}", response_model=Experiment)
    async def update_experiment(experiment_name: str, experiment: Experiment):
        return service.update_experiment(experiment_name=experiment_name, experiment=experiment)

    return router

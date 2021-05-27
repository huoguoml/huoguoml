from typing import List

from fastapi import APIRouter, HTTPException

from huoguoml.schemas.experiment import Experiment, ExperimentIn
from huoguoml.schemas.run import Run
from huoguoml.server.db.service import Service


class ExperimentRouter(object):

    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/experiments",
            tags=["experiments"],
        )

        @router.get("", response_model=List[Experiment])
        async def get_experiments():
            return service.get_experiments()

        @router.post("", response_model=Experiment)
        async def create_experiment(experiment_in: ExperimentIn):
            experiment = service.create_experiment(experiment_in=experiment_in)
            if experiment is None:
                raise HTTPException(status_code=422)
            return experiment

        @router.get("/{experiment_name}", response_model=Experiment)
        async def get_experiment(experiment_name: str):
            experiment = service.get_experiment(experiment_name=experiment_name)
            if experiment is None:
                raise HTTPException(status_code=404)
            return experiment

        @router.get("/{experiment_name}/{experiment_run_nr}", response_model=Run)
        async def get_experiment_run(experiment_name: str, experiment_run_nr: int):
            return service.get_experiment_run(experiment_name=experiment_name,
                                              experiment_run_nr=experiment_run_nr)

        @router.put("/{experiment_name}", response_model=Experiment)
        async def update_experiment(experiment_name: str, experiment: Experiment):
            experiment = service.update_experiment(experiment_name=experiment_name, experiment=experiment)
            if experiment is None:
                raise HTTPException(status_code=404)
            return experiment

        self.router = router

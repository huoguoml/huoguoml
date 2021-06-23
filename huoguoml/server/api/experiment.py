from typing import List, Any

from fastapi import APIRouter, HTTPException

from huoguoml.schema.experiment import Experiment
from huoguoml.schema.run import Run
from huoguoml.server.service.experiment import ExperimentService


class ExperimentRouter(APIRouter):

    def __init__(self, service: ExperimentService, **extra: Any):
        super().__init__(**extra,
                         prefix="/api/experiments",
                         tags=["experiments"])

        @self.get("", response_model=List[Experiment])
        async def get_experiments():
            return service.get_experiments()

        @self.get("/{experiment_name}", response_model=Experiment)
        async def get_experiment(experiment_name: str):
            experiment = service.get_experiment(experiment_name=experiment_name)
            if experiment is None:
                raise HTTPException(status_code=404)
            return experiment

        @self.get("/{experiment_name}/{experiment_run_nr}", response_model=Run)
        async def get_experiment_run(experiment_name: str, experiment_run_nr: int):
            return service.get_experiment_run(experiment_name=experiment_name,
                                              experiment_run_nr=experiment_run_nr)

        @self.put("/{experiment_name}", response_model=Experiment)
        async def update_experiment(experiment_name: str, experiment: Experiment):
            experiment = service.update_experiment(experiment_name=experiment_name, experiment=experiment)
            if experiment is None:
                raise HTTPException(status_code=404)
            return experiment

from typing import List, Optional

from huoguoml.schema.experiment import Experiment
from huoguoml.server.entity.experiment import ExperimentORM
from huoguoml.server.entity.run import RunORM
from huoguoml.server.repository.experiment import ExperimentRepository
from huoguoml.server.service import Service


class ExperimentService(Service):

    def __init__(self, artifact_dir: str):
        super(ExperimentService, self).__init__(artifact_dir=artifact_dir)

        self.repository = ExperimentRepository(database_url=self.database_url,
                                               connect_args=self.connect_args)

    def get_experiments(self) -> List[ExperimentORM]:
        return self.repository.get_experiments()

    def get_experiment(self, experiment_name: str) -> Optional[ExperimentORM]:
        return self.repository.get_experiment(experiment_name=experiment_name)

    def get_experiment_run(self, experiment_name: str, experiment_run_nr: int) -> Optional[RunORM]:
        return self.repository.get_experiment_run(experiment_name=experiment_name,
                                                  experiment_run_nr=experiment_run_nr)

    def update_experiment(self, experiment_name: str, experiment: Experiment) -> Optional[ExperimentORM]:
        experiment_orm = self.repository.update_experiment(experiment_name=experiment_name, experiment=experiment)
        return experiment_orm

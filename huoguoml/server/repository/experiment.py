from typing import List, Dict, Optional

from huoguoml.schema.experiment import Experiment
from huoguoml.server.entity.experiment import ExperimentORM
from huoguoml.server.entity.run import RunORM
from huoguoml.server.repository import Repository


class ExperimentRepository(Repository):

    def __init__(self, database_url: str, connect_args: Dict):
        super(ExperimentRepository, self).__init__(database_url=database_url, connect_args=connect_args)

    def get_experiments(self) -> List[ExperimentORM]:
        session = self.Session()
        return session.query(ExperimentORM).all()

    def get_experiment(self, experiment_name: str) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_name).first()
        return experiment

    def get_experiment_run(self, experiment_name: str, experiment_run_nr: int) -> Optional[RunORM]:
        session = self.Session()
        return session.query(RunORM).filter_by(run_nr=experiment_run_nr, experiment_name=experiment_name
                                               ).first()

    def update_experiment(self, experiment_name: str, experiment: Experiment) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment_orm = session.query(ExperimentORM).filter_by(name=experiment_name, id=experiment.id).first()
        if experiment_orm:
            for field, field_value in experiment.dict(exclude_unset=True, exclude={"id", "runs"}).items():
                setattr(experiment_orm, field, field_value)

            session.commit()
            session.refresh(experiment_orm)
            return experiment_orm

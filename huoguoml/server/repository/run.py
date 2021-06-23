import time
from typing import List, Dict, Optional

from huoguoml.schema.run import RunIn, Run
from huoguoml.server.entity.experiment import ExperimentORM
from huoguoml.server.entity.run import RunORM
from huoguoml.server.repository import Repository


class RunRepository(Repository):

    def __init__(self, database_url: str, connect_args: Dict):
        super(RunRepository, self).__init__(database_url=database_url, connect_args=connect_args)

    def create_run(self, run_in: RunIn) -> RunORM:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=run_in.experiment_name).first()

        if not experiment:
            experiment = ExperimentORM(
                description="",
                name=run_in.experiment_name)
            session.add(experiment)
            session.commit()
            session.refresh(experiment)

        run = RunORM(
            run_nr=len(experiment.runs) + 1,
            creation_time=time.time(),
            last_modification=time.time(),
            finish_time=-1,
            duration=-1,
            description="",
            parameters={},
            metrics={},
            tags={},
            model_definition=None,
            **run_in.dict()
        )

        session.add(run)
        session.commit()
        session.refresh(run)
        return run

    def get_run(self, run_id: int) -> Optional[RunORM]:
        session = self.Session()
        return session.query(RunORM).filter_by(id=run_id).first()

    def update_run(self, run_id: int, run: Run) -> Optional[RunORM]:
        session = self.Session()
        run_orm = session.query(RunORM).filter_by(id=run_id).first()

        if run_orm:
            for field, field_value in run.dict(exclude={"id", "run_nr", "experiment_name", "ml_model"}).items():
                setattr(run_orm, field, field_value)
            run_orm.last_modification = time.time()
            session.commit()
            session.refresh(run_orm)
            return run_orm

    def get_runs_by_experiment_name_and_run_nrs(self, experiment_name: str, run_nrs: List[int]) -> List[RunORM]:
        session = self.Session()
        return session.query(RunORM).filter(experiment_name == RunORM.experiment_name,
                                            RunORM.run_nr.in_(run_nrs)).all()

    def get_runs(self) -> List[RunORM]:
        session = self.Session()
        return session.query(RunORM).all()

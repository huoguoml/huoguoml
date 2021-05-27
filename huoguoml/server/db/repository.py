"""
The huoguoml.database module provides the database that contains all informations
"""
import time
from typing import List, Dict, Optional

from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker, scoped_session

from huoguoml.schemas.experiment import ExperimentIn
from huoguoml.schemas.ml_model import MLModelIn
from huoguoml.schemas.run import RunIn, Run
from huoguoml.server.db.entity import Base, RunORM, MLServiceORM, ExperimentORM, MLModelORM


class Repository(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, database_url: str, connect_args: Dict):
        engine = create_engine(
            database_url, connect_args=connect_args
        )
        session_factory = sessionmaker(bind=engine)
        self.Session = scoped_session(session_factory)
        Base.metadata.create_all(bind=engine)

    # Experiment
    def get_experiments(self) -> List[ExperimentORM]:
        session = self.Session()
        return session.query(ExperimentORM).all()

    def get_experiment(self, experiment_name: str) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_name).first()
        return experiment

    def create_experiment(self, experiment_in: ExperimentIn) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_in.name).first()
        if experiment:
            return None

        experiment = ExperimentORM(
            description="",
            **experiment_in.dict())
        session.add(experiment)
        session.commit()
        session.refresh(experiment)
        return experiment

    # Run
    def create_run(self, run_in: RunIn) -> RunORM:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=run_in.experiment_name).first()

        run = RunORM(
            run_nr=len(experiment.runs) + 1,
            creation_time=time.time(),
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

    def update_experiment(self, experiment_name: str, update_data: Dict) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_name).first()
        if experiment:
            for field, field_value in update_data.items():
                setattr(experiment, field, field_value)

            session.commit()
            session.refresh(experiment)
            return experiment
        return None

    def update_or_create_run(self, run_id: int, run: Run) -> RunORM:
        session = self.Session()
        run_orm = session.query(RunORM).filter_by(id=run_id).first()
        update_data = run.dict(exclude={"id", "run_nr"})

        if run_orm:
            for field, field_value in update_data.items():
                setattr(run_orm, field, field_value)
        else:
            experiment = session.query(ExperimentORM).filter_by(name=run.experiment_name).first()
            run_orm = RunORM(
                run_nr=len(experiment.runs) + 1,
                **update_data)
            session.add(run_orm)
        session.commit()
        session.refresh(run_orm)
        return run_orm

    def get_experiment_run(self, experiment_name: str, experiment_run_nr: int) -> Optional[RunORM]:
        session = self.Session()
        return session.query(RunORM).filter_by(run_nr=experiment_run_nr, experiment_name=experiment_name
                                               ).first()

    def get_runs_by_experiment_name_and_run_nrs(self, experiment_name: str, run_nrs: List[int]) -> List[RunORM]:
        session = self.Session()
        return session.query(RunORM).filter(experiment_name == RunORM.experiment_name,
                                            RunORM.run_nr.in_(run_nrs)).all()

    def get_runs(self) -> List[RunORM]:
        session = self.Session()
        return session.query(RunORM).all()

    # MLModel
    def get_ml_models(self):
        session = self.Session()
        return session.query(MLModelORM).order_by(MLModelORM.name).all()

    def get_ml_model_by_name(self, ml_model_name) -> List[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name).all()

    def create_ml_model(self, ml_model_in: MLModelIn) -> Optional[MLModelORM]:
        session = self.Session()
        run_orm = session.query(RunORM).filter_by(id=ml_model_in.run_id).first()
        if not run_orm or run_orm and run_orm.ml_model:
            return None

        version = session.query(MLModelORM).filter_by(name=ml_model_in.name).count() + 1
        ml_model = MLModelORM(
            tag=None,
            version="v{}".format(version),
            **ml_model_in.dict())
        session.add(ml_model)
        session.commit()
        session.refresh(ml_model)
        return ml_model

    def get_ml_model_by_name_and_tag(self, ml_model_name: str, tag: int) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name,
                                                   tag=tag).first()

    def get_ml_model_by_name_and_latest(self, ml_model_name: str) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name).order_by(desc(MLModelORM.version)).first()

    # Services
    def get_or_create_ml_service(self, host: str, port: int) -> MLServiceORM:
        session = self.Session()

        ml_service = session.query(MLServiceORM).filter_by(host=host, port=port).first()
        if ml_service:
            return ml_service

        ml_service = MLServiceORM(host=host, port=port)
        session.add(ml_service)
        session.commit()
        session.refresh(ml_service)
        return ml_service

    def get_ml_services(self):
        session = self.Session()
        return session.query(MLServiceORM).all()

    def update_ml_service(self, ml_service_id: int, update_data: Dict) -> Optional[MLServiceORM]:
        session = self.Session()
        ml_service = session.query(MLServiceORM).filter_by(name=ml_service_id).first()
        if ml_service:
            for field, field_value in update_data.items():
                setattr(ml_service, field, field_value)

            session.commit()
            session.refresh(ml_service)
            return ml_service
        return None

"""
The huoguoml.database module provides the database that contains all informations
"""
import time
from typing import List, Dict, Optional

from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker, scoped_session

from huoguoml.schemas.experiment import ExperimentIn, Experiment
from huoguoml.schemas.ml_model import MLModelIn, MLModelTag
from huoguoml.schemas.ml_service import MLServiceIn
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

    def update_experiment(self, experiment_name: str, experiment: Experiment) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment_orm = session.query(ExperimentORM).filter_by(name=experiment_name, id=experiment.id).first()
        if experiment_orm:
            for field, field_value in experiment_orm.dict(exclude_unset=True).items():
                setattr(experiment_orm, field, field_value)

            session.commit()
            session.refresh(experiment_orm)
            return experiment_orm

    def update_run(self, run_id: int, run: Run) -> Optional[RunORM]:
        session = self.Session()
        run_orm = session.query(RunORM).filter_by(id=run_id).first()
        update_data = run.dict(exclude={"id", "run_nr"})

        if run_orm:
            for field, field_value in update_data.items():
                setattr(run_orm, field, field_value)
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

    def get_ml_model_files_by_name_and_version(self, ml_model_name: str, ml_model_version: str) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name,
                                                   version=ml_model_version).first()

    # Services
    def create_or_update_ml_service(self, ml_service_in: MLServiceIn) -> Optional[MLServiceORM]:
        session = self.Session()

        ml_model = None
        if ml_service_in.model_rule == "production":
            ml_model = self.get_ml_model_by_name_and_tag(ml_model_name=ml_service_in.model_name,
                                                         tag=MLModelTag.staging.value)
        elif ml_service_in.model_rule == "latest":
            ml_model = self.get_ml_model_by_name_and_latest(ml_model_name=ml_service_in.model_name)
        elif ml_service_in.model_rule == "staging":
            ml_model = self.get_ml_model_by_name_and_tag(ml_model_name=ml_service_in.model_name,
                                                         tag=MLModelTag.staging.value)
        if ml_model:
            ml_service = session.query(MLServiceORM).filter_by(host=ml_service_in.host,
                                                               port=ml_service_in.port).first()
            if ml_service:
                ml_service.model_name = ml_model.name
                ml_service.model_version = ml_model.version
                ml_service.model = ml_model
            else:
                ml_service = MLServiceORM(
                    host=ml_service_in.host,
                    port=ml_service_in.port,
                    model=ml_model,
                    model_name=ml_model.name,
                    model_version=ml_model.version,
                    model_rule=ml_service_in.model_rule,
                )
                session.add(ml_service)
            session.commit()
            session.refresh(ml_service)
            return ml_service

    def get_ml_services(self):
        session = self.Session()
        return session.query(MLServiceORM).all()

    def get_ml_service(self, service_id: int) -> Optional[MLServiceORM]:
        session = self.Session()
        return session.query(MLServiceORM).filter_by(id=service_id).first()

    def update_ml_services_by_model_name(self, ml_model_name: str) -> List[MLServiceORM]:
        session = self.Session()
        ml_services = session.query(MLServiceORM).filter_by(model_name=ml_model_name,
                                                            model_rule="latest").all()
        ml_model = self.get_ml_model_by_name_and_latest(ml_model_name=ml_model_name)
        for ml_service in ml_services:
            ml_service.model_name = ml_model.name
            ml_service.model_version = ml_model.version
            ml_service.model = ml_model

            session.commit()
            session.refresh(ml_service)
        return ml_services

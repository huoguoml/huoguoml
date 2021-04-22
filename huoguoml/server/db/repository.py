"""
The huoguoml.database module provides the database that contains all informations
"""
import time
from typing import List, Dict, Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import huoguoml
from huoguoml.server.db.model import Base, RunORM, ServiceORM, ExperimentORM
from huoguoml.utils.utils import create_hash


class Repository(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, database_url: str, connect_args: Dict):
        engine = create_engine(
            database_url, connect_args=connect_args
        )
        self.Session = sessionmaker(bind=engine)
        Base.metadata.create_all(bind=engine)

    def get_experiments(self) -> List[ExperimentORM]:
        session = self.Session()
        return session.query(ExperimentORM).all()

    def get_experiment(self, experiment_name: str) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_name.lower()).first()
        return experiment

    def create_experiment(self, experiment_name: str) -> Optional[ExperimentORM]:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_name.lower()).first()
        if experiment:
            return None

        experiment = ExperimentORM(name=experiment_name)
        session.add(experiment)
        session.commit()
        session.refresh(experiment)
        return experiment

    def create_run(self, experiment_name: str, author: str) -> RunORM:
        session = self.Session()
        experiment = session.query(ExperimentORM).filter_by(name=experiment_name).first()

        creation_time = time.time()
        run_nr = len(experiment.runs) + 1
        run_id = create_hash(
            value="{}_{}_{}_{}_{}".format(creation_time, run_nr, experiment.name, huoguoml.__version__, author),
            algorithm="md5")
        run = RunORM(id=run_id, run_nr=run_nr, experiment_name=experiment.name, creation_time=creation_time,
                  author=author)

        session.add(run)
        session.commit()
        session.refresh(run)
        return run

    def get_run(self, run_id: str) -> Optional[RunORM]:
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

    def get_or_create_ml_service(self, host: str, port: int) -> ServiceORM:
        session = self.Session()

        ml_service = session.query(ServiceORM).filter_by(host=host, port=port).first()
        if ml_service:
            return ml_service

        ml_service = ServiceORM(host=host, port=port)
        session.add(ml_service)
        session.commit()
        session.refresh(ml_service)
        return ml_service

    def get_ml_services(self):
        session = self.Session()
        return session.query(ServiceORM).all()

    def update_ml_service(self, ml_service_id: int, update_data: Dict) -> Optional[ServiceORM]:
        session = self.Session()
        ml_service = session.query(ServiceORM).filter_by(name=ml_service_id).first()
        if ml_service:
            for field, field_value in update_data.items():
                setattr(ml_service, field, field_value)

            session.commit()
            session.refresh(ml_service)
            return ml_service
        return None

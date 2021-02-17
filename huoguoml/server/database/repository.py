"""
The huoguoml.database module provides the database that contains all informations
"""

from typing import List, Dict

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from huoguoml.server.database.models import Base, Run
from huoguoml.server.database.models import Experiment


class Repository(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, database_url: str, connect_args: Dict):
        engine = create_engine(
            database_url, connect_args=connect_args
        )
        self.Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)

    def get_experiments(self) -> List[Experiment]:
        session = self.Session()
        return session.query(Experiment).all()

    def get_experiment(self, run_id: int) -> Experiment:
        session = self.Session()
        experiment = session.query(Experiment).filter_by(id=run_id).first()
        return experiment

    def get_or_create_experiment(self, experiment_name: str) -> Experiment:
        session = self.Session()
        experiment = session.query(Experiment).filter_by(name=experiment_name).first()

        if not experiment:
            experiment = Experiment(name=experiment_name)

            session.add(experiment)
            session.commit()
            session.refresh(experiment)
        return experiment

    def create_experiment_run(self, experiment_name: str) -> Run:
        experiment_run = Run(experiment_name=experiment_name)

        session = self.Session()
        session.add(experiment_run)
        session.commit()
        session.refresh(experiment_run)

        return experiment_run

    def get_experiment_runs(self) -> List[Run]:
        session = self.Session()
        return session.query(Run).all()

    def get_run(self, run_id: int) -> Run:
        session = self.Session()
        return session.query(Run).filter_by(id=run_id).first()

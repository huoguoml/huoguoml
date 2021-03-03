"""
The huoguoml.database module provides the database that contains all informations
"""
import time
from typing import List, Dict, Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import huoguoml
from huoguoml.server.database.models import Base, Run
from huoguoml.server.database.models import Experiment
from huoguoml.utils import create_hash


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

    def get_experiment(self, experiment_name: str) -> Optional[Experiment]:
        session = self.Session()
        experiment = session.query(Experiment).filter_by(name=experiment_name.lower()).first()
        return experiment

    def create_experiment(self, experiment_name: str) -> Optional[Experiment]:
        session = self.Session()
        experiment = session.query(Experiment).filter_by(name=experiment_name.lower()).first()
        if experiment:
            return None

        experiment = Experiment(name=experiment_name)
        session.add(experiment)
        session.commit()
        session.refresh(experiment)
        return experiment

    def create_run(self, experiment_name: str) -> Run:
        session = self.Session()
        experiment = session.query(Experiment).filter_by(name=experiment_name).first()

        creation_time = time.time()
        run_nr = len(experiment.runs) + 1
        run_id = create_hash(value="{}_{}_{}_{}".format(creation_time, run_nr, experiment.name, huoguoml.__version__),
                             algorithm="md5")
        run = Run(id=run_id, run_nr=run_nr, experiment_name=experiment.name, creation_time=creation_time)

        session.add(run)
        session.commit()
        session.refresh(run)
        return run

    def get_run(self, run_id: str) -> Optional[Run]:
        session = self.Session()
        return session.query(Run).filter_by(id=run_id).first()

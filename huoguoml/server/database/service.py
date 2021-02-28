"""
The huoguoml.database module provides the database that contains all informations
"""
import os
from typing import List, Optional

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_METADATA_FILE
from huoguoml.schemas import Experiment, Run
from huoguoml.server.database.repository import Repository
from huoguoml.utils import save_json, read_json


class Service(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, huoguoml_dir: str):
        self.huoguoml_dir = os.path.realpath(huoguoml_dir)
        os.makedirs(self.huoguoml_dir, exist_ok=True)

        database_url = os.path.join("sqlite:///{}".format(huoguoml_dir), HUOGUOML_DATABASE_FILE)
        connect_args = {"check_same_thread": False}
        self.repository = Repository(database_url=database_url, connect_args=connect_args)

    def get_experiments(self) -> List[Experiment]:
        experiments = self.repository.get_experiments()
        return [Experiment.from_orm(experiment) for experiment in experiments]

    def get_experiment(self, experiment_name: str) -> Optional[Experiment]:
        experiment = self.repository.get_experiment(experiment_name=experiment_name)
        if experiment:
            return Experiment.from_orm(experiment)
        return None

    def create_experiment(self, experiment_name: str) -> Experiment:
        experiment = self.repository.create_experiment(experiment_name=experiment_name)
        os.makedirs(os.path.join(self.huoguoml_dir, experiment.name), exist_ok=True)
        return Experiment.from_orm(experiment)

    def create_run(self, experiment_name) -> Run:
        run_orm = self.repository.create_run(experiment_name=experiment_name)
        run_dir = os.path.join(self.huoguoml_dir, run_orm.experiment_name, str(run_orm.run_nr))
        os.makedirs(run_dir, exist_ok=True)

        run = Run.from_orm(run_orm)
        run.run_dir = run_dir

        run_json_path = os.path.join(run_dir, HUOGUOML_METADATA_FILE)
        save_json(json_path=run_json_path, data=run.json())
        return run

    def get_run(self, run_id: int) -> Optional[Run]:
        run = self.repository.get_run(run_id=run_id)

        experiments_json = read_json(os.path.join(self.huoguoml_dir,
                                                  run.experiment_name,
                                                  str(run.run_nr),
                                                  HUOGUOML_METADATA_FILE))
        if experiments_json:
            return Run.parse_raw(experiments_json)
        return None

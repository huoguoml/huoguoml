"""
The huoguoml.database module provides the database that contains all informations
"""
import os
import shutil
from typing import List, Optional

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_METADATA_FILE
from huoguoml.schemas import Experiment, ModelDefinition, ModelAPI, Run
from huoguoml.server.database.repository import Repository
from huoguoml.utils import save_json, read_json


class Service(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, huoguoml_dir: str):
        self.huoguoml_dir = huoguoml_dir
        os.makedirs(self.huoguoml_dir, exist_ok=True)

        database_url = os.path.join("sqlite:///{}".format(huoguoml_dir), HUOGUOML_DATABASE_FILE)
        connect_args = {"check_same_thread": False}
        self.repository = Repository(database_url=database_url, connect_args=connect_args)

    def get_experiments(self) -> List[Experiment]:
        experiments = self.repository.get_experiments()
        return [Experiment.from_orm(experiment) for experiment in experiments]

    def get_experiment(self, experiment_id: int) -> Experiment:
        experiment = self.repository.get_experiment(experiment_id=experiment_id)
        return Experiment.from_orm(experiment)

    def get_or_create_experiment(self, experiment_name: str) -> Experiment:
        experiment = self.repository.get_or_create_experiment(experiment_name=experiment_name)
        os.makedirs(os.path.join(self.huoguoml_dir, experiment.name), exist_ok=True)
        return Experiment.from_orm(experiment)

    def create_experiment_run(self, experiment_name: str,
                              artifact_dir: str,
                              model_api: ModelAPI,
                              model_definition: ModelDefinition,
                              requirements: List[str]) -> Run:
        experiment_run_orm = self.repository.create_experiment_run(experiment_name)
        experiment_run = Run(id=experiment_run_orm.id,
                             run_nr=experiment_run_orm.run_nr,
                             creation_time=experiment_run_orm.creation_time,
                             experiment_name=experiment_run_orm.experiment_name,
                             model_api=model_api,
                             model_definition=model_definition,
                             requirements=requirements)

        run_dir = os.path.join(self.huoguoml_dir, experiment_run.experiment_name, str(experiment_run_orm.run_nr))
        model_dir = os.path.join(run_dir, "model")
        shutil.copytree(artifact_dir, model_dir)

        run_json_path = os.path.join(run_dir, HUOGUOML_METADATA_FILE)
        save_json(json_path=run_json_path, data=experiment_run.json())
        return experiment_run

    def get_run(self, run_id: int) -> Optional[Run]:
        run = self.repository.get_run(run_id=run_id)

        experiments_json = read_json(os.path.join(self.huoguoml_dir,
                                                  run.experiment_name,
                                                  str(run.run_nr),
                                                  HUOGUOML_METADATA_FILE))
        if not experiments_json:
            return None

        return Run.parse_raw(experiments_json)

    def get_runs(self) -> List[Run]:
        runs = self.repository.get_runs()

        return [Run.from_orm(run) for run in runs]

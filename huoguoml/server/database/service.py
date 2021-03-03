"""
The huoguoml.database module provides the database that contains all informations
"""
import os
from typing import List, Optional

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_METADATA_FILE, HUOGUOML_DEFAULT_ZIP_FOLDER
from huoguoml.schemas import Experiment, Run
from huoguoml.server.database.repository import Repository
from huoguoml.utils import read_json, create_zip_file


class Service(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, huoguoml_dir: str):
        # TODO: Check if absolute path is really necessary
        self.huoguoml_dir = os.path.realpath(huoguoml_dir)
        self.zip_dir = os.path.join(self.huoguoml_dir, HUOGUOML_DEFAULT_ZIP_FOLDER)

        if not os.path.isdir(self.huoguoml_dir):
            os.makedirs(self.huoguoml_dir)
            os.makedirs(self.zip_dir)

        database_url = os.path.join("sqlite:///{}".format(huoguoml_dir), HUOGUOML_DATABASE_FILE)
        connect_args = {"check_same_thread": False}
        self.repository = Repository(database_url=database_url, connect_args=connect_args)

    def get_experiments(self) -> List[Experiment]:
        experiments = self.repository.get_experiments()
        return [Experiment.from_orm(experiment) for experiment in experiments]

    def get_experiment(self, experiment_name: str) -> Optional[Experiment]:
        experiment_orm = self.repository.get_experiment(experiment_name=experiment_name)
        if experiment_orm:
            experiment = Experiment.from_orm(experiment_orm)
            experiment.runs = [self._read_run_file(run) for run in experiment.runs]
            return experiment
        return None

    def get_experiment_run(self, experiment_name: str, experiment_run_nr: int) -> Optional[Run]:
        experiment_orm = self.repository.get_experiment(experiment_name=experiment_name)
        if experiment_orm:
            experiment = Experiment.from_orm(experiment_orm)
            run = next((self._read_run_file(run) for run in experiment.runs if run.run_nr == experiment_run_nr),
                       None)
            return run

    def create_experiment(self, experiment_name: str) -> Experiment:
        experiment = self.repository.create_experiment(experiment_name=experiment_name)
        os.makedirs(os.path.join(self.huoguoml_dir, experiment.name))
        return Experiment.from_orm(experiment)

    def create_run(self, experiment_name) -> Run:
        run_orm = self.repository.create_run(experiment_name=experiment_name)
        run_dir = os.path.join(self.huoguoml_dir, run_orm.experiment_name, str(run_orm.run_nr))
        os.makedirs(run_dir)

        run = Run.from_orm(run_orm)
        run.run_dir = run_dir
        return run

    def get_run_files(self, run_id: str) -> str:
        run_orm = self.repository.get_run(run_id=run_id)
        run = self._read_run_file(run_orm)
        zip_file_path = create_zip_file(src_dir=run.run_dir, dst_dir=self.zip_dir, zip_name=run.id)
        return zip_file_path

    def _read_run_file(self, run: Run) -> Run:
        experiments_json = read_json(os.path.join(self.huoguoml_dir,
                                                  run.experiment_name,
                                                  str(run.run_nr),
                                                  HUOGUOML_METADATA_FILE))
        return Run.parse_raw(experiments_json)

    def update_experiment(self, experiment_name: str, experiment: Experiment) -> Optional[Experiment]:
        update_data = experiment.dict(exclude_unset=True)
        experiment_orm = self.repository.update_experiment(experiment_name=experiment_name, update_data=update_data)
        if experiment_orm:
            experiment = Experiment.from_orm(experiment_orm)
            return experiment
        return None

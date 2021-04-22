"""
The huoguoml.database module provides the database that contains all informations
"""
import os
from typing import List, Optional

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_METADATA_FILE, HUOGUOML_DEFAULT_ZIP_FOLDER
from huoguoml.schemas.experiment import ExperimentIn, Experiment
from huoguoml.schemas.ml_service import MLService
from huoguoml.schemas.run import Run, RunIn
from huoguoml.server.db.repository import Repository
from huoguoml.utils.utils import read_json, create_zip_file, save_json


class Service(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, artifact_dir: str):
        # TODO: Check if absolute path is really necessary
        self.artifact_dir = os.path.realpath(artifact_dir)
        self.zip_dir = os.path.join(self.artifact_dir, HUOGUOML_DEFAULT_ZIP_FOLDER)

        if not os.path.isdir(self.artifact_dir):
            os.makedirs(self.artifact_dir)
            os.makedirs(self.zip_dir)

        database_url = os.path.join("sqlite:///{}".format(artifact_dir), HUOGUOML_DATABASE_FILE)
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

    def create_experiment(self, experiment_in: ExperimentIn) -> Optional[Experiment]:
        experiment_orm = self.repository.create_experiment(experiment_name=experiment_in.name)
        if experiment_orm is None:
            return None

        os.makedirs(os.path.join(self.artifact_dir, experiment_orm.name))
        return Experiment.from_orm(experiment_orm)

    def create_run(self, run: RunIn) -> Run:
        run_orm = self.repository.create_run(experiment_name=run.experiment_name, author=run.author)
        run_dir = os.path.join(self.artifact_dir, run_orm.experiment_name, str(run_orm.run_nr))
        os.makedirs(run_dir)

        run = Run.from_orm(run_orm)

        run_json_path = os.path.join(run_dir, HUOGUOML_METADATA_FILE)
        save_json(json_path=run_json_path, data=run.json())
        return run

    def get_run(self, run_id: str) -> Run:
        run_orm = self.repository.get_run(run_id=run_id)
        run = self._read_run_file(run=run_orm)
        return run

    def get_run_file_path(self, run_id: str) -> str:
        run = self.get_run(run_id=run_id)
        zip_file_path = create_zip_file(src_dir=run.run_dir, dst_dir=self.zip_dir, zip_name=run.id)
        return zip_file_path

    def _read_run_file(self, run: Run) -> Run:
        experiments_json = read_json(os.path.join(self.artifact_dir,
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

    def create_ml_service(self, ml_service: MLService) -> MLService:
        ml_service_orm = self.repository.get_or_create_ml_service(host=ml_service.host, port=ml_service.port)
        return MLService.from_orm(ml_service_orm)

    def get_ml_services(self) -> List[MLService]:
        return self.repository.get_ml_services()

    def update_ml_service(self, ml_service_id: int, ml_service: MLService) -> Optional[MLService]:
        update_data = ml_service.dict(exclude_unset=True)
        ml_service_orm = self.repository.update_ml_service(ml_service_id=ml_service_id, update_data=update_data)
        if ml_service_orm:
            ml_service = MLService.from_orm(ml_service_orm)
            return ml_service
        return None

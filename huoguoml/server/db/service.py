"""
The huoguoml.database module provides the database that contains all informations
"""
import os
from typing import List, Optional

from fastapi import UploadFile

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_DEFAULT_ZIP_FOLDER, HUOGUOML_DEFAULT_MODEL_FOLDER
from huoguoml.schemas.experiment import ExperimentIn, Experiment
from huoguoml.schemas.ml_model import MLModelIn
from huoguoml.schemas.ml_service import MLService
from huoguoml.schemas.run import Run, RunIn
from huoguoml.server.db.model import ExperimentORM, RunORM, MLModelORM, MLServiceORM
from huoguoml.server.db.repository import Repository


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

    def get_experiments(self) -> List[ExperimentORM]:
        return self.repository.get_experiments()

    def get_experiment(self, experiment_name: str) -> Optional[ExperimentORM]:
        return self.repository.get_experiment(experiment_name=experiment_name)

    def get_experiment_run(self, experiment_name: str, experiment_run_nr: int) -> Optional[RunORM]:
        return self.repository.get_experiment_run(experiment_name=experiment_name,
                                                  experiment_run_nr=experiment_run_nr)

    def create_experiment(self, experiment_in: ExperimentIn) -> Optional[ExperimentORM]:
        experiment_orm = self.repository.create_experiment(experiment_in=experiment_in)
        os.makedirs(os.path.join(self.artifact_dir, experiment_orm.name))
        return experiment_orm

    def create_run(self, run_in: RunIn) -> RunORM:
        run_orm = self.repository.create_run(run_in=run_in)
        os.makedirs(os.path.join(self.artifact_dir, run_orm.experiment_name, str(run_orm.run_nr)))
        return run_orm

    def get_run(self, run_id: int) -> Optional[RunORM]:
        return self.repository.get_run(run_id=run_id)

    # def get_run_file_path(self, run_id: str) -> str:
    #     run = self.get_run(run_id=run_id)
    #     zip_file_path = create_zip_file(src_dir=run.run_dir, dst_dir=self.zip_dir, zip_name=run.id)
    #     return zip_file_path

    def update_experiment(self, experiment_name: str, experiment: Experiment) -> Optional[ExperimentORM]:
        update_data = experiment.dict(exclude_unset=True)
        experiment_orm = self.repository.update_experiment(experiment_name=experiment_name, update_data=update_data)
        return experiment_orm

    def create_ml_service(self, ml_service: MLService) -> MLServiceORM:
        return self.repository.get_or_create_ml_service(host=ml_service.host, port=ml_service.port)

    def get_ml_services(self) -> List[MLServiceORM]:
        return self.repository.get_ml_services()

    def update_ml_service(self, ml_service_id: int, ml_service: MLService) -> Optional[MLServiceORM]:
        update_data = ml_service.dict(exclude_unset=True)
        ml_service_orm = self.repository.update_ml_service(ml_service_id=ml_service_id, update_data=update_data)
        return ml_service_orm

    def update_or_create_run(self, run_id: int, run: Run) -> RunORM:
        return self.repository.update_or_create_run(run_id=run_id,
                                                    run=run)

    def update_or_create_run_files(self, run_id: int, files: List[UploadFile]) -> bool:
        run_orm = self.repository.get_run(run_id=run_id)
        if run_orm is None:
            return False

        for file in files:
            file_path = os.path.join(self.artifact_dir,
                                     run_orm.experiment_name,
                                     str(run_orm.run_nr),
                                     HUOGUOML_DEFAULT_MODEL_FOLDER,
                                     file.filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb+") as file_object:
                file_object.write(file.file.read())
        return True

    def get_ml_model(self, ml_model_name: str) -> Optional[MLModelORM]:
        return self.repository.get_ml_model(ml_model_name=ml_model_name)

    def get_ml_models(self) -> List[MLModelORM]:
        return [ml_model.__dict__ for ml_model in self.repository.get_ml_models()]

    def update_or_create_ml_model(self, ml_model_name: str, ml_model_in: MLModelIn) -> MLModelORM:
        return self.repository.update_or_create_ml_model(ml_model_name=ml_model_name, ml_model_in=ml_model_in)

    def get_runs(self, experiment_name: Optional[str], run_nrs: Optional[List[int]]) -> List[RunORM]:
        if experiment_name is not None and run_nrs is not None:
            return self.repository.get_runs_by_experiment_name_and_run_nrs(experiment_name=experiment_name,
                                                                           run_nrs=run_nrs)
        else:
            return self.repository.get_runs()

    def create_ml_model(self, ml_model_in: MLModelIn) -> Optional[MLModelORM]:
        return self.repository.create_ml_model(ml_model_in=ml_model_in)

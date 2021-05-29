"""
The huoguoml.database module provides the database that contains all informations
"""
import os
from itertools import groupby
from operator import attrgetter
from typing import List, Optional

from fastapi import UploadFile

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_DEFAULT_ZIP_FOLDER, HUOGUOML_DEFAULT_MODEL_FOLDER, \
    HUOGUOML_METADATA_FILE
from huoguoml.schemas.experiment import ExperimentIn, Experiment
from huoguoml.schemas.ml_model import MLModelIn, MLModelRegistry
from huoguoml.schemas.ml_service import MLService, MLServiceIn
from huoguoml.schemas.run import Run, RunIn
from huoguoml.server.db.entity import ExperimentORM, RunORM, MLModelORM, MLServiceORM
from huoguoml.server.db.repository import Repository
from huoguoml.util.utils import create_zip_file, save_yaml


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

    def update_experiment(self, experiment_name: str, experiment: Experiment) -> Optional[ExperimentORM]:
        experiment_orm = self.repository.update_experiment(experiment_name=experiment_name, experiment=experiment)
        return experiment_orm

    def create_or_update_ml_service(self, ml_service_in: MLServiceIn) -> MLService:
        return self.repository.create_or_update_ml_service(ml_service_in=ml_service_in)

    def get_ml_services(self) -> List[MLServiceORM]:
        return self.repository.get_ml_services()

    def update_run(self, run_id: int, run: Run) -> Optional[RunORM]:
        return self.repository.update_run(run_id=run_id,
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

    def get_ml_model_by_name(self, ml_model_name: str) -> List[MLModelORM]:
        return self.repository.get_ml_model_by_name(ml_model_name=ml_model_name)

    def get_ml_models_groupby_name(self) -> List[MLModelRegistry]:
        ml_models_orm = self.repository.get_ml_models()

        registry_list = []
        for k, g in groupby(ml_models_orm, attrgetter('name')):
            ml_models = list(g)
            registry = MLModelRegistry(
                name=k,
                ml_models=ml_models
            )
            registry_list.append(
                registry
            )
        return registry_list

    def get_runs(self, experiment_name: Optional[str], run_nrs: Optional[List[int]]) -> List[RunORM]:
        if experiment_name is not None and run_nrs is not None:
            return self.repository.get_runs_by_experiment_name_and_run_nrs(experiment_name=experiment_name,
                                                                           run_nrs=run_nrs)
        else:
            return self.repository.get_runs()

    def create_ml_model(self, ml_model_in: MLModelIn) -> Optional[MLModelORM]:
        return self.repository.create_ml_model(ml_model_in=ml_model_in)

    def get_ml_model_files_by_name_and_version(self, ml_model_name: str, ml_model_version: str) -> Optional[str]:
        ml_model = self.repository.get_ml_model_files_by_name_and_version(ml_model_name=ml_model_name,
                                                                          ml_model_version=ml_model_version)
        if ml_model:
            run = ml_model.run
            run_dir = os.path.join(self.artifact_dir, run.experiment_name, str(run.run_nr))
            save_yaml(yaml_path=os.path.join(run_dir, HUOGUOML_METADATA_FILE),
                      data=Run.from_orm(run).dict())
            zip_file_path = create_zip_file(src_dir=run_dir, dst_dir=self.zip_dir, zip_name=str(run.id))
            return zip_file_path

    def get_ml_service(self, service_id: int) -> Optional[MLServiceORM]:
        return self.repository.get_ml_service(service_id=service_id)


    def update_ml_services_by_model_name(self, ml_model_name: str) -> List[MLServiceORM]:
        return self.repository.update_ml_services_by_model_name(ml_model_name=ml_model_name)

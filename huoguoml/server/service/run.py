import os
from typing import List, Optional

from fastapi import UploadFile

from huoguoml.constants import HUOGUOML_DEFAULT_MODEL_FOLDER, \
    HUOGUOML_METADATA_FILE
from huoguoml.schema.run import Run, RunIn
from huoguoml.server.entity.run import RunORM
from huoguoml.server.repository.run import RunRepository
from huoguoml.server.service import Service
from huoguoml.util.yaml import save_yaml


class RunService(Service):

    def __init__(self, artifact_dir: str):
        super(RunService, self).__init__(artifact_dir=artifact_dir)

        self.repository = RunRepository(database_url=self.database_url,
                                        connect_args=self.connect_args)

    def create_run(self, run_in: RunIn) -> RunORM:
        run_orm = self.repository.create_run(run_in=run_in)
        run_dir = os.path.join(self.artifact_dir, run_orm.experiment_name, str(run_orm.run_nr))
        os.makedirs(run_dir, exist_ok=True)

        save_yaml(yaml_path=os.path.join(run_dir, HUOGUOML_METADATA_FILE),
                  data=Run.from_orm(run_orm).dict())
        return run_orm

    def get_run(self, run_id: int) -> Optional[RunORM]:
        return self.repository.get_run(run_id=run_id)

    def update_run(self, run_id: int, run: Run) -> Optional[RunORM]:
        run = self.repository.update_run(run_id=run_id,
                                         run=run)
        run_dir = os.path.join(self.artifact_dir, run.experiment_name, str(run.run_nr))
        save_yaml(yaml_path=os.path.join(run_dir, HUOGUOML_METADATA_FILE),
                  data=Run.from_orm(run).dict())
        return run

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

    def get_runs(self, experiment_name: Optional[str], run_nrs: Optional[List[int]]) -> List[RunORM]:
        if experiment_name is not None and run_nrs is not None:
            return self.repository.get_runs_by_experiment_name_and_run_nrs(experiment_name=experiment_name,
                                                                           run_nrs=run_nrs)
        else:
            return self.repository.get_runs()

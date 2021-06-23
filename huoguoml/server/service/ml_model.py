import os
from itertools import groupby
from operator import attrgetter
from typing import List, Optional

from huoguoml.schema.ml_model import MLModelIn, MLModelRegistry, MLModel, MLModelTag
from huoguoml.server.entity.ml_model import MLModelORM
from huoguoml.server.entity.ml_service import MLServiceORM
from huoguoml.server.repository.ml_model import MLModelRepository
from huoguoml.server.service import Service
from huoguoml.util.zip import create_zip_file


class MLModelService(Service):

    def __init__(self, artifact_dir: str):
        super(MLModelService, self).__init__(artifact_dir=artifact_dir)

        self.repository = MLModelRepository(database_url=self.database_url,
                                            connect_args=self.connect_args)

    def get_ml_models_by_name(self, ml_model_name: str) -> List[MLModelORM]:
        return self.repository.get_ml_models_by_name(ml_model_name=ml_model_name)

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

    def create_ml_model(self, ml_model_in: MLModelIn) -> Optional[MLModelORM]:
        return self.repository.create_ml_model(ml_model_in=ml_model_in)

    def get_ml_model_files_by_name_and_version(self, ml_model_name: str, ml_model_version: str) -> Optional[str]:
        ml_model = self.repository.get_ml_model_files_by_name_and_version(ml_model_name=ml_model_name,
                                                                          ml_model_version=ml_model_version)
        if ml_model:
            run = ml_model.run
            run_dir = os.path.join(self.artifact_dir, run.experiment_name, str(run.run_nr))
            zip_file_path = create_zip_file(src_dir=run_dir, dst_dir=self.zip_dir, zip_name=str(run.id))
            return zip_file_path

    def update_ml_model(self, ml_model_name: str, ml_model_version: str, ml_model: MLModel):
        return self.repository.update_ml_model(ml_model_name=ml_model_name,
                                               ml_model_version=ml_model_version,
                                               ml_model=ml_model)

    def get_ml_model(self, ml_model_name: str, ml_model_version: str) -> Optional[MLModelORM]:
        return self.repository.get_ml_model(ml_model_name=ml_model_name,
                                            ml_model_version=ml_model_version)

    def get_ml_model_by_tag(self, ml_model_name: str, tag: str) -> Optional[MLModelORM]:
        return self.repository.get_ml_model_by_tag(ml_model_name=ml_model_name,
                                                   tag=tag)

    def update_ml_services_by_model_name(self, ml_model_name: str, ml_model_rule: str) -> List[MLServiceORM]:
        return self.repository.update_ml_services_by_tag_and_rule(ml_model_name=ml_model_name,
                                                                  tag=MLModelTag[ml_model_rule],
                                                                  model_rule=ml_model_rule)

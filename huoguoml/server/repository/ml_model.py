import time
from typing import List, Dict, Optional

from sqlalchemy import desc

from huoguoml.schema.ml_model import MLModelIn, MLModel
from huoguoml.schema.ml_model import MLModelTag
from huoguoml.server.entity.ml_model import MLModelORM
from huoguoml.server.entity.ml_service import MLServiceORM
from huoguoml.server.entity.run import RunORM
from huoguoml.server.repository import Repository


class MLModelRepository(Repository):

    def __init__(self, database_url: str, connect_args: Dict):
        super(MLModelRepository, self).__init__(database_url=database_url, connect_args=connect_args)

    def get_ml_models(self):
        session = self.Session()
        return session.query(MLModelORM).order_by(MLModelORM.name).all()

    def get_ml_models_by_name(self, ml_model_name) -> List[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name).order_by(desc(MLModelORM.version)).all()

    def create_ml_model(self, ml_model_in: MLModelIn) -> Optional[MLModelORM]:
        session = self.Session()
        run_orm = session.query(RunORM).filter_by(id=ml_model_in.run_id).first()
        if not run_orm or run_orm and run_orm.ml_model:
            return None

        version = session.query(MLModelORM).filter_by(name=ml_model_in.name).count() + 1
        ml_model = MLModelORM(
            tag=MLModelTag.none.value,
            version="v{}".format(version),
            creation_time=time.time(),
            last_modification=time.time(),
            **ml_model_in.dict())
        session.add(ml_model)
        session.commit()
        session.refresh(ml_model)
        return ml_model

    def get_ml_model_by_name_and_tag(self, ml_model_name: str, tag: int) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name,
                                                   tag=tag).first()

    def get_ml_model_by_name_and_latest(self, ml_model_name: str) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name).order_by(desc(MLModelORM.version)).first()

    def get_ml_model_files_by_name_and_version(self, ml_model_name: str, ml_model_version: str) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name,
                                                   version=ml_model_version).first()

    def get_ml_model(self, ml_model_name: str, ml_model_version: str) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name,
                                                   version=ml_model_version).first()

    def update_ml_model(self, ml_model_name: str, ml_model_version: str, ml_model: MLModel) -> Optional[MLModelORM]:
        session = self.Session()

        ml_model_orm = session.query(MLModelORM).filter_by(name=ml_model_name,
                                                           version=ml_model_version).first()
        if ml_model_orm:
            temp = session.query(MLModelORM).filter_by(name=ml_model_name, tag=ml_model.tag).first()
            if temp and (ml_model.tag == MLModelTag.staging.value or ml_model.tag == MLModelTag.production.value):
                temp.tag = MLModelTag.none.value

            for field, field_value in ml_model.dict(exclude={"id", "run_id", "version", "name"}).items():
                setattr(ml_model_orm, field, field_value)
            session.commit()
            session.refresh(ml_model_orm)

        return ml_model_orm

    def get_ml_model_by_tag(self, ml_model_name: str, tag: str) -> Optional[MLModelORM]:
        session = self.Session()
        return session.query(MLModelORM).filter_by(name=ml_model_name,
                                                   tag=MLModelTag[tag.lower()]).first()

    # TODO: REFACTOR BELOW
    def update_ml_services_by_tag_and_rule(self, ml_model_name: str, model_rule: str, tag: int) -> List[MLServiceORM]:
        session = self.Session()
        ml_services = session.query(MLServiceORM).filter_by(model_name=ml_model_name,
                                                            model_rule=model_rule).all()
        if len(ml_services) == 0:
            return []

        if model_rule == "latest":
            ml_model = self.get_ml_model_by_name_and_latest(ml_model_name=ml_model_name)
        else:
            ml_model = self.get_ml_model_by_name_and_tag(ml_model_name=ml_model_name, tag=tag)

        for ml_service in ml_services:
            ml_service.model_name = ml_model.name
            ml_service.model_version = ml_model.version
            ml_service.model = ml_model
            session.commit()
            session.refresh(ml_service)
        return ml_services

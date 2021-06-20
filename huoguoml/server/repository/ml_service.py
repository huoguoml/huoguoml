from typing import Dict, Optional

from sqlalchemy import desc

from huoguoml.schema.ml_model import MLModelTag
from huoguoml.schema.ml_service import MLServiceIn
from huoguoml.server.entity.ml_model import MLModelORM
from huoguoml.server.entity.ml_service import MLServiceORM
from huoguoml.server.repository import Repository


class MLServiceRepository(Repository):

    def __init__(self, database_url: str, connect_args: Dict):
        super(MLServiceRepository, self).__init__(database_url=database_url, connect_args=connect_args)

    def create_or_update_ml_service(self, ml_service_in: MLServiceIn) -> Optional[MLServiceORM]:
        session = self.Session()

        ml_model = None
        if ml_service_in.model_rule == "production" or ml_service_in.model_rule == "staging":
            ml_model = session.query(MLModelORM).filter_by(name=ml_service_in.model_name,
                                                           tag=MLModelTag[ml_service_in.model_rule]).first()
        elif ml_service_in.model_rule == "latest":
            ml_model = session.query(MLModelORM).filter_by(name=ml_service_in.model_name).order_by(
                desc(MLModelORM.version)).first()

        if ml_model:
            ml_service = session.query(MLServiceORM).filter_by(host=ml_service_in.host,
                                                               port=ml_service_in.port).first()
            if ml_service:
                ml_service.model_name = ml_model.name
                ml_service.model_version = ml_model.version
                ml_service.model = ml_model
            else:
                ml_service = MLServiceORM(
                    host=ml_service_in.host,
                    port=ml_service_in.port,
                    model=ml_model,
                    model_name=ml_model.name,
                    model_version=ml_model.version,
                    model_rule=ml_service_in.model_rule,
                )
                session.add(ml_service)
            session.commit()
            session.refresh(ml_service)
            return ml_service

    def get_ml_services(self):
        session = self.Session()
        return session.query(MLServiceORM).all()

    def get_ml_service(self, service_id: int) -> Optional[MLServiceORM]:
        session = self.Session()
        return session.query(MLServiceORM).filter_by(id=service_id).first()

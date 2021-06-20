from typing import List, Optional

from huoguoml.schema.ml_service import MLService, MLServiceIn
from huoguoml.server.entity.ml_service import MLServiceORM
from huoguoml.server.repository.ml_service import MLServiceRepository
from huoguoml.server.service import Service


class MLServiceService(Service):

    def __init__(self, artifact_dir: str):
        super(MLServiceService, self).__init__(artifact_dir=artifact_dir)

        self.repository = MLServiceRepository(database_url=self.database_url,
                                              connect_args=self.connect_args)

    def create_or_update_ml_service(self, ml_service_in: MLServiceIn) -> MLService:
        return self.repository.create_or_update_ml_service(ml_service_in=ml_service_in)

    def get_ml_services(self) -> List[MLServiceORM]:
        return self.repository.get_ml_services()

    def get_ml_service(self, service_id: int) -> Optional[MLServiceORM]:
        return self.repository.get_ml_service(service_id=service_id)



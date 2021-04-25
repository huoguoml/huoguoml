from typing import List

from fastapi import APIRouter

from huoguoml.schemas.ml_service import MLService
from huoguoml.server.db.service import Service


class MLServiceRouter(object):
    # TODO: rework
    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/v1/ml_services",
            tags=["ml_services"],
        )

        @router.post("", response_model=MLService)
        async def create_ml_service(ml_service: MLService):
            # TODO: Check if both ml_service.host and port are equal to the request one
            return service.create_ml_service(ml_service)

        @router.get("", response_model=List[MLService])
        async def get_ml_services():
            return service.get_ml_services()

        self.router = router

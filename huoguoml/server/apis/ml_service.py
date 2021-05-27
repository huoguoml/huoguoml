from typing import List

from fastapi import APIRouter, HTTPException

from huoguoml.schemas.ml_service import MLService, MLServiceIn
from huoguoml.server.db.service import Service


class MLServiceRouter(object):
    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/services",
            tags=["services"],
        )

        @router.post("", response_model=MLService)
        async def create_ml_service(ml_service_in: MLServiceIn):
            ml_service = service.create_ml_service(ml_service_in=ml_service_in)
            if not ml_service:
                raise HTTPException(status_code=400)
            return ml_service

        @router.get("", response_model=List[MLService])
        async def get_ml_services():
            return service.get_ml_services()

        @router.get("/{service_id}", response_model=MLService)
        async def get_ml_service(service_id: int):
            ml_service = service.get_ml_service(service_id=service_id)
            if not ml_service:
                raise HTTPException(status_code=404)
            return ml_service

        self.router = router

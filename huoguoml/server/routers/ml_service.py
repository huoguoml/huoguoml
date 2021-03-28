from typing import List

from fastapi import APIRouter

from huoguoml.schemas import MLService
from huoguoml.server.database.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/rest/ml_services",
        tags=["services"],
    )

    @router.post("", response_model=MLService)
    async def post_ml_service(ml_service: MLService):
        # TODO: Check if both ml_service.host and port are equal to the request one
        return service.create_ml_service(ml_service)

    @router.get("", response_model=List[MLService])
    async def get_ml_services():
        return service.get_ml_services()

    @router.patch("/{ml_service_id}", response_model=MLService)
    async def update_ml_service(ml_service_id: int, ml_service: MLService):
        return service.update_ml_service(ml_service_id=ml_service_id, ml_service=ml_service)

    return router

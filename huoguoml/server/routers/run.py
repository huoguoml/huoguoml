from fastapi import APIRouter

from fastapi import APIRouter

from huoguoml.schemas import RunDetail
from huoguoml.server.database.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/rest/runs",
        tags=["experiments"],
        responses={404: {"description": "Not found"}},
    )

    @router.get("/{run_id}", response_model=RunDetail)
    async def get_run(run_id: int):
        return service.get_run(run_id=run_id)

    return router

from fastapi import APIRouter

from huoguoml.schemas import Run
from huoguoml.server.database.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/rest/runs",
        tags=["runs"],
        responses={404: {"description": "Not found"}},
    )

    @router.get("/{run_id}", response_model=Run)
    async def get_run(run_id: str):
        return service.get_run(run_id=run_id)

    return router

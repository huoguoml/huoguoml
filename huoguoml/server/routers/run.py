from fastapi import APIRouter
from starlette.responses import FileResponse

from huoguoml.server.database.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/rest/runs",
        tags=["runs"],
        responses={404: {"description": "Not found"}},
    )

    @router.get("/{run_id}")
    async def get_run(run_id: str):
        run = service.get_run_files(run_id=run_id)
        return FileResponse(run, media_type='application/zip')

    return router

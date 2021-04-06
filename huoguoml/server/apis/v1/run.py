from fastapi import APIRouter
from starlette.responses import FileResponse

from huoguoml.schemas.run import Run
from huoguoml.server.db.service import Service


def get_router(service: Service) -> APIRouter:
    router = APIRouter(
        prefix="/api/v1/runs",
        tags=["runs"],
    )

    @router.get("/{run_id}")
    async def get_run(run_id: str):
        run_file_path = service.get_run_file_path(run_id=run_id)
        return FileResponse(run_file_path, media_type='application/zip')

    @router.post("")
    async def create_run(run: Run):
        return service.create_run(run=run)

    return router

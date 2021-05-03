from typing import List

from fastapi import APIRouter, HTTPException, UploadFile, File

from huoguoml.schemas.run import RunIn, Run
from huoguoml.server.db.service import Service


# from starlette.responses import FileResponse


class RunRouter(object):
    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/v1/runs",
            tags=["runs"],
        )

        @router.get("/{run_id}", response_model=Run)
        async def get_run(run_id: int):
            run = service.get_run(run_id=run_id)
            if run is None:
                raise HTTPException(status_code=404)
            return run

        @router.post("", response_model=Run)
        async def create_run(run_in: RunIn):
            return service.create_run(run_in=run_in)

        @router.put("/{run_id}", response_model=Run)
        async def update_or_create_run(run_id: int, run: Run):
            return service.update_or_create_run(run_id=run_id, run=run)

        @router.put("/files/{run_id}")
        async def update_or_create_run_files(run_id: int, files: List[UploadFile] = File(...)):
            return service.update_or_create_run_files(run_id=run_id, files=files)

        @router.get("/files/{run_id}")
        async def get_run_files(run_id: int):
            # return FileResponse(run_file_path, media_type='application/zip')
            raise NotImplementedError()

        self.router = router

from typing import List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Query

from huoguoml.schemas.run import RunIn, Run
from huoguoml.server.db.service import Service


class RunRouter(object):
    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/runs",
            tags=["runs"],
        )

        @router.get("", response_model=List[Run])
        async def get_runs(experiment_name: Optional[str] = Query(None),
                           run_nrs: Optional[str] = Query(None,
                                                          description="String that contains a set of comma seperated "
                                                                      "numbers e.g. '1,2,3,4'")):
            if run_nrs is not None:
                numbers = []
                for el in run_nrs.split(','):
                    el = el.strip()
                    if not el.isnumeric():
                        raise HTTPException(status_code=422,
                                            detail="Element {} in {} is not a number".format(el, run_nrs))
                    numbers.append(int(el))
                run_nrs = numbers
            runs = service.get_runs(experiment_name=experiment_name,
                                    run_nrs=run_nrs)
            return runs

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
        async def update_run(run_id: int, run: Run):
            run = service.update_run(run_id=run_id, run=run)
            if run is None:
                raise HTTPException(status_code=404)
            return run

        @router.put("/files/{run_id}")
        async def update_or_create_run_files(run_id: int, files: List[UploadFile] = File(...)):
            return service.update_or_create_run_files(run_id=run_id, files=files)

        self.router = router

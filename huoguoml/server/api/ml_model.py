from typing import List

import requests
from fastapi import APIRouter, HTTPException
from starlette.background import BackgroundTasks
from starlette.responses import FileResponse

from huoguoml.schemas.ml_model import MLModelIn, MLModel, MLModelRegistry
from huoguoml.schemas.ml_service import MLService
from huoguoml.server.db.service import Service
from huoguoml.util.utils import concat_uri, coerce_url


class MLModelRouter(object):

    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/models",
            tags=["models"],
        )

        def notify_services(ml_model_name: str):
            ml_services = service.update_ml_services_by_model_name(ml_model_name=ml_model_name)
            for ml_service in ml_services:
                uri = "{}:{}".format(coerce_url(ml_service.host), ml_service.port)
                ml_service_obj = MLService.from_orm(ml_service)
                update_api = concat_uri(uri, "api", "update")
                requests.post(update_api, json=ml_service_obj.dict()).raise_for_status()

        @router.get("", response_model=List[MLModelRegistry])
        async def get_ml_models_groupby_name():
            return service.get_ml_models_groupby_name()

        @router.post("", response_model=MLModel)
        async def create_ml_model(ml_model_in: MLModelIn, background_tasks: BackgroundTasks):
            # TODO: Check if both ml_service.host and port are equal to the request one
            ml_model = service.create_ml_model(ml_model_in=ml_model_in)
            background_tasks.add_task(notify_services, ml_model_name=ml_model_in.name)
            if ml_model is None:
                raise HTTPException(status_code=400)
            return ml_model

        @router.get("/{ml_model_name}", response_model=List[MLModel])
        async def get_ml_model(ml_model_name: str):
            ml_model = service.get_ml_model_by_name(ml_model_name=ml_model_name)
            if not ml_model:
                raise HTTPException(status_code=404)
            return ml_model

        @router.get("/{ml_model_name}/{ml_model_version}")
        async def get_ml_model(ml_model_name: str, ml_model_version: str):
            file_path = service.get_ml_model_files_by_name_and_version(ml_model_name=ml_model_name,
                                                                       ml_model_version=ml_model_version)
            if not file_path:
                raise HTTPException(status_code=404)

            return FileResponse(file_path, media_type='application/zip')

        self.router = router

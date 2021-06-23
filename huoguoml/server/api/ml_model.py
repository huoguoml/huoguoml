from typing import List, Optional, Any

import requests
from fastapi import APIRouter, HTTPException, Request, Query
from starlette.background import BackgroundTasks
from starlette.responses import FileResponse

from huoguoml.schema.ml_model import MLModelIn, MLModel, MLModelRegistry, MLModelTag
from huoguoml.schema.ml_service import MLService
from huoguoml.server.service.ml_model import MLModelService
from huoguoml.util.string import concat_uri, coerce_url


class MLModelRouter(APIRouter):

    def __init__(self, service: MLModelService, **extra: Any):
        super().__init__(**extra, prefix="/api/models", tags=["models"])

        def notify_services(ml_model_name: str, ml_model_rule: str):
            ml_services = service.update_ml_services_by_model_name(ml_model_name=ml_model_name,
                                                                   ml_model_rule=ml_model_rule)
            for ml_service in ml_services:
                uri = "{}:{}".format(coerce_url(ml_service.host), ml_service.port)
                ml_service_obj = MLService.from_orm(ml_service)
                update_api = concat_uri(uri, "api", "update")
                requests.post(update_api, json=ml_service_obj.dict()).raise_for_status()

        @self.get("", response_model=List[MLModelRegistry])
        async def get_ml_models_groupby_name():
            return service.get_ml_models_groupby_name()

        @self.post("", response_model=MLModel)
        async def create_ml_model(ml_model_in: MLModelIn, background_tasks: BackgroundTasks):
            ml_model = service.create_ml_model(ml_model_in=ml_model_in)
            background_tasks.add_task(notify_services, ml_model_name=ml_model_in.name, ml_model_rule="latest")
            if ml_model is None:
                raise HTTPException(status_code=400)
            return ml_model

        @self.put("/{ml_model_name}/{ml_model_version}", response_model=MLModel)
        async def update_ml_model(ml_model_name: str, ml_model_version: str, ml_model: MLModel,
                                  background_tasks: BackgroundTasks):
            ml_model = service.update_ml_model(ml_model_name=ml_model_name,
                                               ml_model_version=ml_model_version,
                                               ml_model=ml_model)

            if ml_model.tag == MLModelTag.production.value:
                background_tasks.add_task(notify_services, ml_model_name=ml_model.name, ml_model_rule="production")
            elif ml_model.tag == MLModelTag.staging.value:
                background_tasks.add_task(notify_services, ml_model_name=ml_model.name, ml_model_rule="staging")
            else:
                raise HTTPException(status_code=400)

            if ml_model is None:
                raise HTTPException(status_code=400)
            return ml_model

        @self.get("/{ml_model_name}/{ml_model_version}", response_model=MLModel, responses={
            200: {
                "content": {"application/zip": {}},
                "description": "Return the model as json or models files as zip",
            }
        })
        async def get_ml_model_by_version(ml_model_name: str, ml_model_version: str, request: Request):
            response = service.get_ml_model(ml_model_name=ml_model_name,
                                            ml_model_version=ml_model_version)
            if not response:
                raise HTTPException(status_code=404)

            if request.headers.get('accept', "") == "application/zip":
                file_path = service.get_ml_model_files_by_name_and_version(ml_model_name=response.name,
                                                                           ml_model_version=response.version)
                response = FileResponse(file_path, media_type='application/zip')
            return response

        @self.get("/{ml_model_name}", response_model=List[MLModel])
        async def get_ml_models(ml_model_name: str,
                                tag: Optional[str] = Query(None,
                                                           description="Model tag as string (available: "
                                                                       "production, staging"),
                                ):
            if tag is not None:
                ml_model = service.get_ml_model_by_tag(ml_model_name=ml_model_name,
                                                       tag=tag)
                if not ml_model:
                    raise HTTPException(status_code=404)
                file_path = service.get_ml_model_files_by_name_and_version(ml_model_name=ml_model.name,
                                                                           ml_model_version=ml_model.version)

                return FileResponse(file_path, media_type='application/zip')
            else:
                ml_models = service.get_ml_models_by_name(ml_model_name=ml_model_name)
                if not ml_models:
                    raise HTTPException(status_code=404)
                return ml_models

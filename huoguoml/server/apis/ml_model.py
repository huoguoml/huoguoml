from typing import List

from fastapi import APIRouter, HTTPException

from huoguoml.schemas.ml_model import MLModelIn, MLModel, MLModelRegistry
from huoguoml.server.db.service import Service


class MLModelRouter(object):

    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/models",
            tags=["models"],
        )

        @router.get("", response_model=List[MLModelRegistry])
        async def get_ml_models_groupby_name():
            return service.get_ml_models_groupby_name()

        @router.get("/{ml_model_name}", response_model=List[MLModel])
        async def get_ml_model_by_name(ml_model_name: str):
            ml_model = service.get_ml_model_by_name(ml_model_name=ml_model_name)
            if ml_model is None:
                raise HTTPException(status_code=404)
            return ml_model

        @router.post("", response_model=MLModel)
        async def create_ml_model(ml_model_in: MLModelIn):
            # TODO: Check if both ml_service.host and port are equal to the request one
            ml_model = service.create_ml_model(ml_model_in=ml_model_in)
            if ml_model is None:
                raise HTTPException(status_code=400)
            return ml_model

        self.router = router

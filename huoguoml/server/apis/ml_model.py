from typing import List

from fastapi import APIRouter, HTTPException

from huoguoml.schemas.ml_model import MLModelIn, MLModel
from huoguoml.server.db.service import Service


class MLModelRouter(object):

    def __init__(self, service: Service):
        router = APIRouter(
            prefix="/api/ml_models",
            tags=["ml_models"],
        )

        @router.get("", response_model=List[MLModel])
        async def get_ml_models():
            return service.get_ml_models()

        @router.get("/{ml_model_name}", response_model=MLModel)
        async def get_ml_models(ml_model_name: str):
            ml_model = service.get_ml_model(ml_model_name=ml_model_name)
            if ml_model is None:
                raise HTTPException(status_code=404)
            return ml_model

        @router.put("/{ml_model_name}", response_model=MLModel)
        async def update_or_create_ml_model(ml_model_name: str, ml_model_in: MLModelIn):
            # TODO: Check if both ml_service.host and port are equal to the request one
            ml_model = service.update_or_create_ml_model(ml_model_name=ml_model_name, ml_model_in=ml_model_in)
            return ml_model

        self.router = router

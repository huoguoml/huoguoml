from fastapi import FastAPI


class ServiceBuilder(object):

    def __init__(self):
        app = FastAPI()

        # at the same time predict is used for logging
        @app.get("/predict")
        async def predict():
            # or "error": ...
            return {"result": [1, 2, 3, 4]}

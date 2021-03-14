import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from huoguoml.server.database.service import Service
from huoguoml.server.routers import experiment, run


def start_huoguoml_server(artifact_dir: str, host: str, port: int):
    """
    Starts the HuoguoML server

    Args:
        artifact_dir: Location of the artifact directory
        host: The network address to listen on
        port: The port to listen on
    """
    service = Service(artifact_dir=artifact_dir)
    app = FastAPI()

    origins = [
        "*",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(experiment.get_router(service=service))
    app.include_router(run.get_router(service=service))

    @app.get("/")
    async def root():
        return {"message": "Hello Bigger Applications!"}

    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_server("../../examples/huoguoml", "127.0.0.1", 8080)

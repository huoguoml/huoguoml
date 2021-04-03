import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from huoguoml.server.apis.v1 import ml_service, experiment, run
from huoguoml.server.db.service import Service


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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "*",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(experiment.get_router(service=service))
    app.include_router(run.get_router(service=service))
    app.include_router(ml_service.get_router(service=service))

    dashboard_files_dir = os.path.join(os.path.dirname(__file__),
                                       "dashboard",
                                       "build")

    app.mount("/",
              StaticFiles(directory=dashboard_files_dir, html=True),
              name="static")

    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_server("../../examples/huoguoml", "127.0.0.1", 8080)

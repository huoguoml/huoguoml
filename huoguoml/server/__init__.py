import os
import shutil

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from huoguoml.server.api.experiment import ExperimentRouter
from huoguoml.server.api.ml_model import MLModelRouter
from huoguoml.server.api.ml_service import MLServiceRouter
from huoguoml.server.api.run import RunRouter
from huoguoml.server.service.experiment import ExperimentService
from huoguoml.server.service.ml_model import MLModelService
from huoguoml.server.service.ml_service import MLServiceService
from huoguoml.server.service.run import RunService


def start_huoguoml_server(artifact_dir: str, host: str, port: int):
    """
    Starts the HuoguoML server

    Args:
        artifact_dir: Location of the artifact directory
        host: The network address to listen on
        port: The port to listen on
    """

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(ExperimentRouter(service=ExperimentService(artifact_dir=artifact_dir)))
    app.include_router(RunRouter(service=RunService(artifact_dir=artifact_dir)))
    app.include_router(MLServiceRouter(service=MLServiceService(artifact_dir=artifact_dir)))
    app.include_router(MLModelRouter(service=MLModelService(artifact_dir=artifact_dir)))

    dashboard_files_dir = os.path.join(os.path.dirname(__file__),
                                       "..",
                                       "dashboard",
                                       "build")
    if os.path.isdir(dashboard_files_dir):
        shutil.copyfile(os.path.join(dashboard_files_dir, "index.html.orig"),
                        os.path.join(dashboard_files_dir, "index.html"))

        with open(os.path.join(dashboard_files_dir, "index.html")) as f:
            newIndexFile = f.read().replace('__HUOGUOML_API_URL__', "http://{}:{}".format(host, port))

        with open(os.path.join(dashboard_files_dir, "index.html"), "w") as f:
            f.write(newIndexFile)

        shutil.copyfile(os.path.join(dashboard_files_dir, "index.html"),
                        os.path.join(dashboard_files_dir, "404.html"))
        shutil.copyfile(os.path.join(dashboard_files_dir, "index.html"),
                        os.path.join(dashboard_files_dir, "405.html"))
        app.mount("/",
                  StaticFiles(directory=dashboard_files_dir, html=True),
                  name="static")

    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_server("../../huoguoml-dev/server", "127.0.0.1", 8080)

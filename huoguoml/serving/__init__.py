import requests
import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from huoguoml.schema.ml_service import MLServiceIn, MLService
from huoguoml.serving.api import HuoguoMLRouter
from huoguoml.util.string import coerce_url, concat_uri


def start_huoguoml_service(host: str, port: int, model_name: str, model_rule: str, server_uri: str, artifact_dir: str):
    """
    Starts the HuoguoML serving

    Args:
        server_uri: The URI to the HuoguoML server
        host: The network address to listen on
        port: The port to listen on
        model_name: The name of the model that should be used
        model_rule: The rule for pulling the model e.g. production for always using the production model
                    (default: latest). Following rules are available: latest, staging, production
        artifact_dir: Location of the artifact directory
    """
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    server_uri = coerce_url(server_uri)

    server_res = requests.get(server_uri)
    if server_res.status_code >= 400:
        raise ConnectionError(
            "HuoguoML server cannot be found on {}. Start server with 'huoguoml server' and or try another server uri".format(
                server_uri))

    ml_service_in = MLServiceIn(host=host, port=port, model_name=model_name, model_rule=model_rule)
    response = requests.post(concat_uri(server_uri, "api", "services"), json=ml_service_in.dict())
    ml_service = MLService.parse_raw(response.text)

    router = HuoguoMLRouter(ml_service=ml_service, server_uri=server_uri,
                            artifact_dir=artifact_dir, prefix="/api")
    app.include_router(router)
    uvicorn.run(app, host=host, port=port)


if __name__ == '__main__':
    start_huoguoml_service(host="127.0.0.1", port=5000,
                           server_uri="http://localhost:8080",
                           model_name="mnist",
                           model_rule="latest",
                           artifact_dir="../../huoguoml-dev/serving")

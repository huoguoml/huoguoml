import requests

from huoguoml.constants import HUOGUOML_DEFAULT_SERVICE_PORT, HUOGUOML_DEFAULT_SERVICE_HOST
from huoguoml.schemas import MLService


class Client(object):

    def __init__(self, server_uri: str = "{}:{}".format(HUOGUOML_DEFAULT_SERVICE_HOST, HUOGUOML_DEFAULT_SERVICE_PORT)):
        try:
            _ = requests.get(server_uri)
            self.server_uri = server_uri
        except:
            raise ConnectionError("HuoguoML server is not running. Start server with huoguoml server and try again")

    def get_experiment(self, experiment_name):
        pass

    def post_experiment(self, experiment_name):
        pass

    def post_run(self, experiment_name):
        # getpass.getuser()
        pass

    def post_ml_services(self, register_api: str, service_host: str, service_port: int):
        ml_service = MLService(host=service_host, port=service_port)
        response = requests.post(register_api, json=ml_service.dict(exclude_unset=True))
        return MLService.parse_raw(response.text)

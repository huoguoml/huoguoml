import requests

from huoguoml.schemas import MLService


class Client(object):

    def __init__(self, server_uri: str):
        # TODO CHECK IF CONNECTION IS AVAILABLE
        print("hi")

    def get_experiment(self, experiment_name):
        pass

    def post_experiment(self, experiment_name):
        pass

    def post_run(self, experiment_name, server_uri):
        pass

    def post_ml_services(self, register_api: str, service_host: str, service_port: int):
        ml_service = MLService(host=service_host, port=service_port)
        response = requests.post(register_api, json=ml_service.dict(exclude_unset=True))
        return MLService.parse_raw(response.text)

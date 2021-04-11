"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
import getpass

import requests
from pydantic import ValidationError

from huoguoml.schemas.experiment import Experiment, ExperimentIn
from huoguoml.schemas.run import Run, RunIn
from huoguoml.utils import concat_uri


class HuoguoRun(object):

    def __init__(self,
                 server_uri: str,
                 experiment_name: str):
        try:
            get_res = requests.get(server_uri)
            get_res.raise_for_status()
        except requests.exceptions.MissingSchema:
            raise requests.exceptions.MissingSchema
        except (requests.exceptions.HTTPError,
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.RequestException):
            raise ConnectionError("HuoguoML server is not running. Start server with 'huoguoml server' and try again")

        try:
            exp_res = requests.get(concat_uri(server_uri, "api", "v1", "experiments", experiment_name))
            experiment = Experiment.parse_raw(exp_res.text)
        except ValidationError:
            exp_in = ExperimentIn(name=experiment_name)
            print(concat_uri(server_uri, "api", "v1", "experiments"))
            exp_res = requests.post(
                concat_uri(server_uri, "api", "v1", "experiments"),
                data=exp_in.dict())
            print(exp_res)
            experiment = Experiment.parse_raw(exp_res.text)

        run_in = RunIn(experiment_name=experiment.name, author=getpass.getuser())
        run_res = requests.post(
            concat_uri(server_uri, "api", "v1", "runs"),
            json=run_in.dict(exclude_unset=True))
        self.run = Run.parse_raw(run_res.text)
        self.server_uri = server_uri

    def log_model(self,
                  model_type: str,
                  **kwargs):
        if self.run.model_definition:
            raise FileExistsError("A model was already logged")

        if model_type == "tensorflow":
            from huoguoml.tracking.tensorflow import log_model
            log_model(run=self.run, **kwargs)

    def log_parameter(self, parameter_name: str, parameter_value: str):
        self.run.parameters[parameter_name] = parameter_value

    def log_metric(self, metric_name: str, metric_value: str):
        self.run.metrics[metric_name] = metric_value

    def log_tag(self, tag_name: str, tag_value: str):
        self.run.tags[tag_name] = tag_value

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_value:
            self.run.end_experiment_run(failed=True)
        else:
            self.run.end_experiment_run(failed=False)

        requests.put(
            concat_uri(self.server_uri, "api", "v1", "runs"),
            json=self.run.dict(exclude_unset=True))


def start_experiment_run(experiment_name: str,
                         server_uri: str = "127.0.0.1:8080"):
    """
    Start a HuoguoML experiments run and returns it. The return value can be used as a context manager within a with
    block; otherwise, you must call end_experiment_run() to terminate the current run. In addition the HuoguoML server
    must be running.

    Args:
        experiment_name: Name of the experiment under which to create the experiment run
        server_uri: Uri to the HuoguoML server. (default: 127.0.0.1:8080)
    """
    return HuoguoRun(server_uri=server_uri, experiment_name=experiment_name)

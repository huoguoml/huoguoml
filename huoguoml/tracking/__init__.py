"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
import getpass
import time
from typing import List, Optional

import requests

from huoguoml.schema.experiment import Experiment, ExperimentIn
from huoguoml.schema.run import Run, RunIn, RunStatus
from huoguoml.util.string import concat_uri, coerce_url


class HuoguoMLRun(object):

    def __init__(self,
                 experiment_name: str,
                 server_uri: str):
        self.server_uri = server_uri

        experiment_api = concat_uri(self.server_uri, "api", "experiments")
        exp_res = requests.get(concat_uri(experiment_api, experiment_name))
        if exp_res.status_code.real == 404:
            exp_in = ExperimentIn(name=experiment_name)
            exp_res = requests.post(
                experiment_api,
                data=exp_in.json())
        experiment = Experiment.parse_raw(exp_res.text)

        run_in = RunIn(experiment_name=experiment.name, author=getpass.getuser())
        run_res = requests.post(
            concat_uri(self.server_uri, "api", "runs"),
            data=run_in.json())

        self._run = Run.parse_raw(run_res.text)

    def log_model(self,
                  model_type: str,
                  **kwargs):
        if self._run.model_definition:
            raise FileExistsError("Model already logged")

        if model_type == "tensorflow":
            from huoguoml.tracking.tensorflow import log_model
            model_definition, model_files = log_model(**kwargs)
        else:
            raise NotImplementedError("HuoguoML does not support {} at the moment".format(model_type))

        self._run.model_definition = model_definition
        self._update_experiment_run(model_files)

    def log_parameter(self, parameter_name: str, parameter_value: str):
        self._run.parameters[parameter_name] = parameter_value
        self._update_experiment_run()

    def log_metric(self, metric_name: str, metric_value: str):
        self._run.metrics[metric_name] = metric_value
        self._update_experiment_run()

    def log_tag(self, tag_name: str, tag_value: str):
        self._run.tags[tag_name] = tag_value
        self._update_experiment_run()

    def end_experiment_run(self, failed=False):
        self._run.finish_time = time.time()
        self._run.duration = self._run.finish_time - self._run.creation_time

        if failed:
            self._run.status = RunStatus.failed.value
        else:
            self._run.status = RunStatus.completed.value

        self._update_experiment_run()

    def _update_experiment_run(self, files: Optional[List] = None):
        api = concat_uri(self.server_uri, "api", "runs", str(self._run.id))
        if files:
            requests.put(concat_uri(api, "files"), files=files)

        requests.put(
            api,
            data=self._run.json())

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_value:
            self.end_experiment_run(failed=True)
        else:
            self.end_experiment_run(failed=False)


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
    server_uri = coerce_url(server_uri)

    server_res = requests.get(server_uri)
    if server_res.status_code >= 400:
        raise ConnectionError(
            "HuoguoML server cannot be found on {}. Start server with 'huoguoml server' and or try another server uri".format(
                server_uri))

    return HuoguoMLRun(server_uri=server_uri, experiment_name=experiment_name)

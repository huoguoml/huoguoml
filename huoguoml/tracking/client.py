import getpass
import time
from abc import ABC
from typing import Optional, List

import requests
from starlette.datastructures import UploadFile

from huoguoml.schema.run import RunStatus, Run, RunIn
from huoguoml.server import RunService
from huoguoml.util.string import concat_uri


class HuoguoMLRun(object):

    def __init__(self,
                 run: Run):
        self._run = run

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
        raise NotImplementedError

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_value:
            self.end_experiment_run(failed=True)
        else:
            self.end_experiment_run(failed=False)


class HuoguoMLAPIRun(HuoguoMLRun, ABC):

    def __init__(self, experiment_name: str, server_uri: str):
        self.server_uri = server_uri

        run_in = RunIn(experiment_name=experiment_name, author=getpass.getuser())
        run_res = requests.post(
            concat_uri(self.server_uri, "api", "runs"),
            json=run_in.dict())

        super(HuoguoMLAPIRun, self).__init__(run=Run.parse_raw(run_res.text))

    def _update_experiment_run(self, files: Optional[List] = None):
        api = concat_uri(self.server_uri, "api", "runs", str(self._run.id))
        if files:
            requests.put(concat_uri(api, "files"), files=files)

        requests.put(
            api,
            json=self._run.dict())


class HuoguoMLLocalRun(HuoguoMLRun, ABC):

    def __init__(self, experiment_name: str, artifact_dir: str):
        self.service = RunService(artifact_dir=artifact_dir)

        run_in = RunIn(experiment_name=experiment_name, author=getpass.getuser())
        run_orm = self.service.create_run(run_in=run_in)

        super(HuoguoMLLocalRun, self).__init__(run=Run.from_orm(run_orm))

    def _update_experiment_run(self, files: Optional[List] = None):
        if files:
            files = [UploadFile(filename=filename, file=file) for _, (filename, file) in files]
            self.service.update_or_create_run_files(run_id=self._run.id, files=files)

        self.service.update_run(run_id=self._run.id, run=self._run)

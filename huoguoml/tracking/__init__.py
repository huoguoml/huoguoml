"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
import os
from typing import Optional

import requests

from huoguoml.constants import HUOGUOML_DEFAULT_FOLDER
from huoguoml.tracking.client import HuoguoMLAPIRun, HuoguoMLRun, HuoguoMLLocalRun
from huoguoml.util.string import coerce_url


def start_experiment_run(experiment_name: str,
                         artifact_dir: Optional[str] = None,
                         server_uri: Optional[str] = None) -> HuoguoMLRun:
    """
    Start a HuoguoML experiments run and returns it. The return value can be used as a context manager within a with
    block; otherwise, you must call end_experiment_run() to terminate the current run.

    The HugouoML run helps you keep track of your experiment metadata. You can store the metadata in the local file
    system if artifact_dir is specified, or you can send it directly to a HuoguoML tracking server by specifying a
    server_uri.

    Args:
        experiment_name: Name of the experiment under which to create the experiment run
        server_uri: Uri to the HuoguoML server e.g 127.0.0.1:8080
        artifact_dir: The location of the .huoguoml artifact directory for the metadata

    Raises:
        ConnectionError: If Server cannot be found
        ValueError: If server_uri and artifact_dir are both given
    """
    if artifact_dir and server_uri:
        raise ValueError("Either server_rui or artifact_dir must be passed, not both")

    elif server_uri:
        server_uri = coerce_url(server_uri)

        server_res = requests.get(server_uri)
        if server_res.status_code >= 400:
            raise ConnectionError(
                "HuoguoML server cannot be found on {}. Start server with 'huoguoml server' and or try another server "
                "uri".format(
                    server_uri))

        return HuoguoMLAPIRun(server_uri=server_uri, experiment_name=experiment_name)

    elif artifact_dir:
        return HuoguoMLLocalRun(experiment_name=experiment_name,
                                artifact_dir=os.path.join(artifact_dir, HUOGUOML_DEFAULT_FOLDER))

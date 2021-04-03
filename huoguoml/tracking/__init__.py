"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
from typing import Optional

from huoguoml.client import Client


def start_experiment_run(experiment_name: Optional[str] = None,
                         server_uri: str = "./huoguoml"):
    """
    Start a HuoguoML experiments run and returns it. The return value can be used as a context manager within a with
    block; otherwise, you must call end_experiment_run() to terminate the current run. In addition the HuoguoML server
    must be running.

    Args:
        experiment_name: Name of the experiment under which to create the experiment run
        server_uri: Uri to the HuoguoML server. (default: 127.0.0.1)
    """
    client = Client(server_uri=server_uri)

    experiment = client.get_experiment(experiment_name=experiment_name)
    if not experiment:
        experiment = client.create_experiment(experiment_name=experiment_name)
    return client.create_run(experiment_name=experiment.name, server_uri=server_uri)

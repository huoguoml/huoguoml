"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
from typing import Optional

import huoguoml
from huoguoml.server.database.service import Service


def start_experiment_run(experiment_name: Optional[str] = None,
                         artifact_dir: str = "./huoguoml"):
    """
    Start a HuoguoML experiments run and returns it. The return value can be used as a context manager within a with
    block; otherwise, you must call end_experiment_run() to terminate the current run.

    Args:
        experiment_name: Name of the experiment under which to create the experiment run

        artifact_dir: location of the HuoguoML directory. (default: ./huoguoml)
    """
    service = Service(artifact_dir=artifact_dir)

    experiment = service.get_experiment(experiment_name=experiment_name)
    if not experiment:
        experiment = service.create_experiment(experiment_name=experiment_name)
    run = service.create_run(experiment_name=experiment.name)
    huoguoml.current_run = run
    return run

"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
from typing import Optional

import huoguoml
from huoguoml.server.database.service import Service


def start_experiment_run(experiment_name: Optional[str] = None,
                         run_id: Optional[int] = None,
                         huoguoml_dir: str = "./huoguoml"):
    """
    Start a HuoguoML experiments run. If the experiment does not exist a new one will be created.

    Args:
        run_id:
        experiment_name: name of the experiment
        huoguoml_dir: location of the HuoguoML directory. (default: ./huoguoml)
    """
    service = Service(huoguoml_dir=huoguoml_dir)

    if experiment_name:
        experiment = service.get_experiment(experiment_name=experiment_name)
        if not experiment:
            experiment = service.create_experiment(experiment_name=experiment_name)
        run = service.create_run(experiment_name=experiment.name)
        huoguoml.current_run = run
    elif run_id:
        run = service.get_run(run_id=run_id)
        huoguoml.current_run = run
    return run

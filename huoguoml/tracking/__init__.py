"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
import os

import huoguoml
from huoguoml.server.database.service import Service


def start_experiment(experiment_name, huoguoml_dir="./huoguoml"):
    """
    Start a HuoguoML experiments. If the experiment does not exist a new one will be created.

    Args:
        experiment_name: name of the experiment
        huoguoml_dir: location of the HuoguoML directory. (default: ./huoguoml)
    """
    os.makedirs(huoguoml_dir, exist_ok=True)
    service = Service(huoguoml_dir=huoguoml_dir)
    experiment = service.get_or_create_experiment(experiment_name=experiment_name)

    huoguoml.current_experiment = experiment
    huoguoml.service = service

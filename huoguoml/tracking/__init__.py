"""
The huoguoml.tracking module provides the options for tracking all experiment runs
"""
import os

import huoguoml
from huoguoml.constants import HUOGUOML_EXPERIMENTS_FILE, HUOGUOML_EXPERIMENT_FILE
from huoguoml.types import Experiments, Experiment
from huoguoml.utils import read_json, save_json


def create_experiment(experiment_name, huoguoml_path="./huoguoml"):
    """
    Create a HuoguoML experiments, if not exist and set it as current experiment

    Args:
        experiment_name: name of the experiment
        huoguoml_path: path to the HuoguoML directory. (default: ./huoguoml)
    """
    os.makedirs(huoguoml_path, exist_ok=True)

    experiments_json_path = os.path.join(huoguoml_path, HUOGUOML_EXPERIMENTS_FILE)
    experiments_json = read_json(experiments_json_path)

    if experiments_json is None:
        experiments = Experiments()
    else:
        experiments = Experiments.parse_raw(experiments_json)

    find_experiment = (experiment for experiment in experiments.experiments if experiment.name == experiment_name)
    experiment = next(find_experiment, None)

    if experiment is None:
        experiment = Experiment(name=experiment_name, id=len(experiments.experiments))
        experiments.add_experiment(experiment)
        save_json(json_path=experiments_json_path, data=experiments.json())

    experiment_dir = os.path.join(huoguoml_path, experiment_name)
    os.makedirs(experiment_dir, exist_ok=True)
    huoguoml.experiment_dir = experiment_dir

    huoguoml.experiment = experiment
    experiment_path = os.path.join(experiment_dir, HUOGUOML_EXPERIMENT_FILE)
    save_json(json_path=experiment_path, data=experiment.json())

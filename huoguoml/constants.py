"""
The huoguoml.constants module contains used throughout the whole package
"""
from typing import List

import huoguoml

HUOGUOML_EXPERIMENT_RUN_FILE: str = ".huoguoml_run"
HUOGUOML_EXPERIMENT_FILE: str = ".huoguoml_experiment"
HUOGUOML_EXPERIMENTS_FILE: str = ".huoguoml_experiments"

HUOGUOML_DEFAULT_REQUIREMENTS: List[str] = ["huoguoml={}".format(huoguoml.__version__)]

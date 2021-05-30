"""
The huoguoml.util.yaml module contains some utility functions for yaml operations.
"""
from typing import Any

import yaml


def read_yaml(yaml_path: str) -> Any:
    """Read a yaml file and return the content. Returns None if not exist
    """
    with open(yaml_path) as yaml_file:
        data = yaml.load(yaml_file, Loader=yaml.FullLoader)
        return data


def save_yaml(yaml_path: str, data: Any):
    """Save data as yaml format
    """
    with open(yaml_path, 'w') as yaml_file:
        yaml.dump(data, yaml_file)

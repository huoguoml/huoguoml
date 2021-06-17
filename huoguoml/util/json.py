"""
The huoguoml.util.string module contains some utility functions for json operations.
"""
import json
from typing import Any


def read_json(json_path: str) -> Any:
    """Read a json file and return the content. Returns None if not exist
    """
    with open(json_path) as json_file:
        data = json.load(json_file)
        return data


def save_json(json_path: str, data: Any):
    """Save data as json format
    """
    with open(json_path, 'w') as json_file:
        json.dump(data, json_file)

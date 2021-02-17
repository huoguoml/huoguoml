"""
The huoguoml.utils module contains some utility functions used throughout the whole package
"""
import hashlib
import json
import os
from typing import Any, Optional


def read_json(json_path: str) -> Optional[Any]:
    """Read a json file and return the content. Returns None if not exist
    """
    if not os.path.isfile(json_path):
        return None

    with open(json_path) as json_file:
        data = json.load(json_file)
        return data


def save_json(json_path: str, data: Any):
    """Save data as json format
    """
    with open(json_path, 'w') as json_file:
        json.dump(data, json_file)


def create_hash(value: str, algorithm: str) -> str:
    """
    Returns the hash value for a given string value with the given algorithm.
    Supported hash algorithms can be seen with following lines of code:

        import hashlib
        print(hashlib.algorithms_available)
    """
    encoded_value = value.encode("utf-8")
    hash_object = hashlib.new(name=algorithm, data=encoded_value)
    hash_value = hash_object.hexdigest()
    return hash_value


def create_huoguoml_folders(huoguoml_path: str):
    """
    Create HuoguoML folders if not exist

    Args:
        huoguoml_path: path to the huoguoml dir

    NOTE: Required for later stages, when huoguoml folder gets larger
    """
    os.makedirs(huoguoml_path, exist_ok=True)

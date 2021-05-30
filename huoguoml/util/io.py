"""
The huoguoml.util.string module contains some utility functions for io operations.
"""
import os


def create_huoguoml_folders(huoguoml_path: str):
    """
    Create HuoguoML folders if not exist

    Args:
        huoguoml_path: path to the huoguoml dir

    NOTE: Required for later stages, when huoguoml folder gets larger
    """
    os.makedirs(huoguoml_path, exist_ok=True)

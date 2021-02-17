"""
The huoguoml.constants module contains used throughout the whole package
"""
from typing import List

import huoguoml

HUOGUOML_METADATA_FILE: str = ".huoguoml_meta"
HUOGUOML_DATABASE_FILE: str = "huoguoml.db"
HUOGUOML_DEFAULT_REQUIREMENTS: List[str] = ["huoguoml={}".format(huoguoml.__version__)]
HUOGUOML_DEFAULT_MODEL_FOLDER: str = "model"

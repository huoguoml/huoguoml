"""
The huoguoml.constants module contains used throughout the whole package
"""
from typing import List

import huoguoml

HUOGUOML_METADATA_FILE: str = "huoguoml_meta"
HUOGUOML_DATABASE_FILE: str = "huoguoml.db"
HUOGUOML_DEFAULT_REQUIREMENTS: List[str] = ["huoguoml={}".format(huoguoml.__version__)]
HUOGUOML_DEFAULT_MODEL_FOLDER: str = "model"
HUOGUOML_DEFAULT_ZIP_FOLDER: str = "zips"
HUOGUOML_DEFAULT_FOLDER: str = ".huoguoml"

# SERVICE
HUOGUOML_DEFAULT_SERVICE_PORT: int = 5000
HUOGUOML_DEFAULT_SERVICE_HOST: str = "127.0.0.1"

# SERVER
HUOGUOML_DEFAULT_SERVER_FOLDER: str = ".huoguoml"
HUOGUOML_DEFAULT_SERVER_PORT: int = 8080

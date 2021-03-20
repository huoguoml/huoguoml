"""
The huoguoml.utils module contains some utility functions used throughout the whole package
"""
import hashlib
import json
import os
import zipfile
from io import BytesIO
from typing import Any, Optional
from urllib.request import urlopen
from zipfile import ZipFile


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


def create_zip_file(src_dir: str, dst_dir: str, zip_name: str) -> str:
    """
    Creates a zip file out of a whole directory and saves it under a given name at a given directory
    Args:
        src_dir: source directory
        dst_dir: destination directory
        zip_name: name of the output zip

    Returns:
        zip_file_path: path to the zip file
    """
    zip_file_path = os.path.join(dst_dir, "{}.zip".format(zip_name))
    if not os.path.isfile(zip_file_path):
        zip_file = zipfile.ZipFile(zip_file_path, "w", zipfile.ZIP_DEFLATED)
        abs_src_dir = os.path.abspath(src_dir)
        for dirname, subdirs, files in os.walk(src_dir):
            for filename in files:
                absname = os.path.abspath(os.path.join(dirname, filename))
                arcname = absname[len(abs_src_dir) + 1:]
                zip_file.write(absname, arcname)
        zip_file.close()
    return zip_file_path


def download_and_extract_run_files(run_uri: str, dst_dir: str):
    """
    Gets a URI to a ZIP file, downloads it and extract it to a specific folder.
    """
    with urlopen(run_uri) as zip_file_response:
        with ZipFile(BytesIO(zip_file_response.read())) as zip_file:
            zip_file.extractall(dst_dir)

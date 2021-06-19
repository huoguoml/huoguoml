"""
The huoguoml.util.string module contains some utility functions for json operations.
"""

import os
import zipfile
from io import BytesIO
from zipfile import ZipFile

import requests


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


def download_and_extract_zip_file(zip_uri: str, dst_dir: str):
    """
    Gets a URI to a ZIP file, downloads it and extract it to a specific folder.
    """
    with requests.get(zip_uri,
                      headers={"accept": "application/zip"}) as zip_file_response:
        with ZipFile(BytesIO(zip_file_response.content)) as zip_file:
            zip_file.extractall(dst_dir)

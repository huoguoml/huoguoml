import os

from huoguoml.constants import HUOGUOML_DATABASE_FILE, HUOGUOML_DEFAULT_ZIP_FOLDER


class Service(object):

    def __init__(self, artifact_dir: str):
        self.artifact_dir = os.path.realpath(artifact_dir)
        self.zip_dir = os.path.join(self.artifact_dir, HUOGUOML_DEFAULT_ZIP_FOLDER)

        if not os.path.isdir(self.artifact_dir):
            os.makedirs(self.artifact_dir)
            os.makedirs(self.zip_dir)

        self.database_url = os.path.join("sqlite:///{}".format(artifact_dir), HUOGUOML_DATABASE_FILE)
        self.connect_args = {"check_same_thread": False}

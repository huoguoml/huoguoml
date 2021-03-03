"""
The huoguoml.cli module contains code for the HuoguoML CLI
"""
import os

import click

from huoguoml.constants import HUOGUOML_DEFAULT_SERVICE_FOLDER
from huoguoml.server.main import start_huoguoml_server
from huoguoml.service.main import start_huoguoml_service
from huoguoml.utils import download_and_extract_run_files


@click.group()
@click.version_option()
def cli():
    """
    The HuoguoML CLI. Start the HuoguoML tracking server with 'huoguoml server' or
    a service with 'huoguoml service'
    """
    pass


@cli.command()
@click.option(
    "--host",
    default="127.0.0.1",
    help="The network address to listen on (default: 127.0.0.1).",
)
@click.option(
    "--port",
    default=8080,
    help="The port to listen on (default: 8080).",
)
@click.option(
    "--huoguoml_dir",
    default="./huoguoml",
    help="The location of the HuoguoML directory (default: ./huoguoml).",
)
def server(host: str, port: int, huoguoml_dir: str):
    """
    Run the HuoguoML tracking server.
    The server listens on http://localhost:5000 by default, and only
    accept connections from the local machine. To let the server accept
    connections from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    start_huoguoml_server(huoguoml_dir=huoguoml_dir,
                          host=host,
                          port=port)

#
# @cli.command()
# @click.option(
#     "--host",
#     default="127.0.0.1",
#     help="The network address to listen on (default: 127.0.0.1).",
# )
# @click.option(
#     "--port",
#     default=8080,
#     help="The port to listen on (default: 8080).",
# )
# @click.option(
#     "--run_uri",
#     help="The uri to the run files",
# )
def service(host: str, port: int, run_uri: str):
    """
    Run a HuoguoML service.
    The service listens on http://localhost:8080 by default, and only
    accept connections from the local machine. To let the server accept
    request from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    # TODO: Check if run_uri is correct
    workspace_dir = HUOGUOML_DEFAULT_SERVICE_FOLDER
    run_id = os.path.basename(run_uri)
    run_dir = os.path.join(workspace_dir, run_id)
    os.makedirs(run_dir, exist_ok=True)
    download_and_extract_run_files(run_uri=run_uri, dst_dir=run_dir)
    start_huoguoml_service(host=host, port=port, artifact_dir=run_dir)


if __name__ == "__main__":
    service(host="0.0.0.0", port=5000, run_uri="http://localhost:8080/rest/runs/e239b6a9233d7dacbc568048016dc210")

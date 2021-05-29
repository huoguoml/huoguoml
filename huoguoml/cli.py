"""
The huoguoml.cli module contains code for the HuoguoML CLI
"""

import click

from huoguoml.constants import HUOGUOML_DEFAULT_SERVER_FOLDER, HUOGUOML_DEFAULT_SERVICE_FOLDER, \
    HUOGUOML_DEFAULT_SERVICE_HOST, HUOGUOML_DEFAULT_SERVICE_PORT
from huoguoml.server import start_huoguoml_server
from huoguoml.service import start_huoguoml_service


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
    "--artifact_dir",
    default=HUOGUOML_DEFAULT_SERVER_FOLDER,
    help="The location of the artifact directory for the HuoguoML server (default: {}).".format(
        HUOGUOML_DEFAULT_SERVER_FOLDER),
)
def server(host: str, port: int, artifact_dir: str):
    """
    Run the HuoguoML tracking server.
    The server listens on http://127.0.0.1:5000 by default, and only
    accept connections from the local machine. To let the server accept
    connections from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    start_huoguoml_server(artifact_dir=artifact_dir,
                          host=host,
                          port=port)


@cli.command()
@click.option(
    "--host",
    default=HUOGUOML_DEFAULT_SERVICE_HOST,
    help="The network address to listen on (default: {}).".format(HUOGUOML_DEFAULT_SERVICE_HOST),
)
@click.option(
    "--port",
    default=HUOGUOML_DEFAULT_SERVICE_PORT,
    help="The port to listen on (default: {}).".format(HUOGUOML_DEFAULT_SERVICE_PORT),
)
@click.option(
    "--server_uri",
    help="The uri to the HuoguoML server",
)
@click.option(
    "--model_name",
    help="The name of the model that should be used",
)
@click.option(
    "--model_rule",
    help="The rule for pulling the model e.g. production for always using the production model (default: latest). "
         "Following rules are available: latest, staging, production",
)
@click.option(
    "--artifact_dir",
    default=HUOGUOML_DEFAULT_SERVICE_FOLDER,
    help="The location of the artifact directory for the HuoguoML service (default: {}).".format(
        HUOGUOML_DEFAULT_SERVICE_FOLDER),
)
def service(host: str, port: int, server_uri: str, model_name: str, model_rule: str, artifact_dir: str):
    """
    Run a HuoguoML service.
    The service listens on http://127.0.0.1:8080 by default, and only
    accept connections from the local machine. To let the server accept
    request from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    start_huoguoml_service(host=host, port=port, server_uri=server_uri, model_name=model_name,
                           model_rule=model_rule, artifact_dir=artifact_dir)

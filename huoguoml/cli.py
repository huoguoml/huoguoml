"""
The huoguoml.cli module contains code for the HuoguoML CLI
"""
import os

import click

from huoguoml.constants import HUOGUOML_DEFAULT_SERVICE_HOST, HUOGUOML_DEFAULT_SERVICE_PORT, HUOGUOML_DEFAULT_FOLDER
from huoguoml.server import start_huoguoml_server
from huoguoml.serving import start_huoguoml_service


@click.group()
@click.version_option()
def cli():
    """
    The HuoguoML CLI. Start the HuoguoML tracking server with 'huoguoml server' or
    a serving with 'huoguoml serving'
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
    default="/",
    help="The location of the .huoguoml artifact directory for the HuoguoML server (default: /)",
)
def server(host: str, port: int, artifact_dir: str):
    """
    Run the HuoguoML tracking server.
    The server listens on http://127.0.0.1:5000 by default, and only
    accept connections from the local machine. To let the server accept
    connections from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    start_huoguoml_server(artifact_dir=os.path.join(artifact_dir, HUOGUOML_DEFAULT_FOLDER),
                          host=host,
                          port=port)


@cli.command()
@click.option(
    "--host",
    default="127.0.0.1",
    help="The network address to listen on (default: {127.0.0.1}).",
)
@click.option(
    "--port",
    default=5000,
    help="The port to listen on (default: 5000).",
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
    default="/",
    help="The location of the .huoguoml artifact directory for the HuoguoML serving. (default: /)",
)
def serving(host: str, port: int, server_uri: str, model_name: str, model_rule: str, artifact_dir: str):
    """
    Run a HuoguoML Serving client.
    The client listens on http://127.0.0.1:5000 by default, and only
    accept connections from the local machine. To let the client accept
    request from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    start_huoguoml_service(host=host, port=port, server_uri=server_uri, model_name=model_name,
                           model_rule=model_rule, artifact_dir=os.path.join(artifact_dir, HUOGUOML_DEFAULT_FOLDER))

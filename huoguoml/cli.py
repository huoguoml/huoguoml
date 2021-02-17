"""
The huoguoml.cli module contains code for the HuoguoML CLI
"""
import click

from huoguoml.server.main import start_huoguoml_server
from huoguoml.server.legacy.repository import Repository
from huoguoml.service.main import start_huoguoml_service


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
    print("Start server")
    start_huoguoml_server(huoguoml_dir=huoguoml_dir,
                          host=host,
                          port=port)


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
    metavar="VERSION",
    help="TO BE REMOVED",
)
def service(host: str, port: int, artifact_dir: str):
    """
    Run a HuoguoML service.
    The service listens on http://localhost:8080 by default, and only
    accept connections from the local machine. To let the server accept
    request from other machines, you will need to pass `--host 0.0.0.0`
    to listen on all network interfaces (or a specific interface address).
    """
    print("Start service")
    print(host, port)
    start_huoguoml_service(artifact_dir)


if __name__ == "__main__":
    cli()

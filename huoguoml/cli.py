import argparse
import sys

from huoguoml import __version__


def parse_args(parser, commands):
    # Divide argv by commands
    split_argv = [[]]
    for c in sys.argv[1:]:
        if c in commands.choices:
            split_argv.append([c])
        else:
            split_argv[-1].append(c)
    # Initialize namespace
    args = argparse.Namespace()
    for c in commands.choices:
        setattr(args, c, None)
    # Parse each command
    parser.parse_args(split_argv[0], namespace=args)  # Without command
    for argv in split_argv[1:]:  # Commands
        n = argparse.Namespace()
        setattr(args, argv[0], n)
        parser.parse_args(argv, namespace=n)
    return args


def _cli_help_version(parser):
    parser._positionals.title = "Arguments"
    parser._optionals.title = "Options"

    parser.add_argument("--version", action="version",
                        version="HuoguoML version {}".format(__version__),
                        help="Show version number.")
    parser.add_argument("--help", action="help", default=argparse.SUPPRESS,
                        help="Show help message.")


def _cli_host_port_dir(parser):
    parser.add_argument("--host", action="store_const",
                        const=str, default="127.0.0.1",
                        help="The network address to listen on (default: 127.0.0.1). \
                              Use 0.0.0.0 to bind to all addresses if you want to \
                              access the model server from other machines.")
    parser.add_argument("--port", action="store_const",
                        const=int, default=8080,
                        help="The port to listen on (default: 8080).")
    parser.add_argument("--huoguoml_dlr", action="store_const",
                        const=str, default="./huoguoml",
                        help="The location of the HuoguoML directory (default: ./huoguoml).")


def cli():
    parser = argparse.ArgumentParser(description=
                                     """The HuoguoML CLI. Start the HuoguoML model server with 
                                     'huoguoml server' or a service with 'huoguoml service'""",
                                     add_help=False)
    _cli_help_version(parser)

    commands = parser.add_subparsers(title="Commands")

    # SERVER
    server_parser = commands.add_parser(name="server",
                                        description="Run the HuoguoML model server.\
    The server listens on http://localhost:5000 by default, and only\
    accept connections from the local machine. To let the server accept\
    connections from other machines, you will need to pass ``--host 0.0.0.0``\
    to listen on all network interfaces (or a specific interface address).",
                                        help="Start a HuoguoML server",
                                        add_help=False)
    _cli_host_port_dir(server_parser)
    _cli_help_version(server_parser)

    # SERVICE
    service_parser = commands.add_parser(name="service",
                                         help="Start a HuoguoML service",
                                         add_help=False)
    _cli_host_port_dir(service_parser)
    _cli_help_version(service_parser)

    args = parse_args(parser, commands)
    if args.server:
        server_args = args.server
        server(server_args.host, server_args.port, server_args.huoguoml_dlr)
    elif args.service:
        service_args = args.service
        service(service_args.host, service_args.port)
    else:
        parser.print_help()
    exit(0)


def server(host: str, port: int, huoguoml_dlr: str):
    print("Start server")


def service(host: str, port: int):
    print("Start service")
    print(host, port)


if __name__ == "__main__":
    cli()

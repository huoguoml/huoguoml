import argparse
import os
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


def _cli(parser):
    parser._positionals.title = 'Arguments'
    parser._optionals.title = 'Options'

    parser.add_argument('--host', action='store_const',
                        const=str, default="127.0.0.1",
                        help='The network address to listen on (default: 127.0.0.1). \
                              Use 0.0.0.0 to bind to all addresses if you want to \
                              access the tracking server from other machines.')
    parser.add_argument('--port', action='store_const',
                        const=int, default=8080,
                        help='The port to listen on (default: 8080).')

    parser.add_argument('--version', action='version',
                        version='HuoguoML version {}'.format(__version__),
                        help="Show version number and exit.")
    parser.add_argument('--help', action='help', default=argparse.SUPPRESS,
                        help='Show help message and exit.')


def cli():
    parser = argparse.ArgumentParser(description=
                                     """The HuoguoML CLI.\n\nStart the HuoguoML tracking server with 
                                     'huoguoml server' or a Serving service with 'huoguoml service'""",
                                     add_help=False)
    _cli(parser)

    commands = parser.add_subparsers(title="Commands")

    # SERVER
    server_parser = commands.add_parser(name='server',
                                        description="Run the HuoguoML tracking server.\n\n\
    The server listens on http://localhost:5000 by default, and only\
    accept connections from the local machine. To let the server accept\
    connections from other machines, you will need to pass ``--host 0.0.0.0``\
    to listen on all network interfaces (or a specific interface address).",
                                        help='Run a HuoguoML service',
                                        add_help=False)
    _cli(server_parser)

    # SERVICE
    service_parser = commands.add_parser(name='service',
                                         help='Run a HuoguoML Serving service',
                                         add_help=False)
    service_parser.add_argument('--service_dir', action='store_const',
                                const=str, default=os.getcwd(),
                                help='The port to listen on (default: ./).')
    _cli(service_parser)
    args = parse_args(parser, commands)
    print(args)
    if args.server:
        server_args = args.server
        start_server(server_args.host, server_args.port)
    else:
        service_args = args.service
        start_service(service_args.host, service_args.port, service_args.service_dir)


def start_server(host, port):
    print("Start server")


def start_service(host: str, port: int, service_dir: str):
    print("Start service")
    print(host, port, service_dir)


if __name__ == "__main__":
    cli()

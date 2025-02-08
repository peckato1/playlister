import argparse
import loguru
import os
import sys

import playlister


def param(arg, env_var, default=None):
    if arg is not None:
        return arg

    val = os.environ.get(env_var)
    if val is None and default is None:
        raise ValueError(f"Neither argument not environment variable '{env_var}' set and no default provided")
    return val if val != None else default


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Playlister daemon')
    parser.add_argument('--log-level', help='Log level, info by default', choices=['trace', 'debug', 'info', 'warning', 'error', 'critical'])
    parser.add_argument('--db-host', help='Database host')
    parser.add_argument('--db-port', type=int, help='Database port', default=5432)
    parser.add_argument('--db-user', help='Database user')
    parser.add_argument('--db-password', help='Database password')
    parser.add_argument('--db-name', help='Database name')

    args = parser.parse_args()

    loguru.logger.remove()
    loguru.logger.add(sys.stderr, level=param(args.log_level, 'PLAYLISTER_LOG_LEVEL', 'info').upper())

    sys.exit(playlister.PlaylisterDaemon(
        database_host=param(args.db_host, 'PLAYLISTER_DB_HOST'),
        database_port=param(args.db_port, 'PLAYLISTER_DB_PORT', 5432),
        database_user=param(args.db_user, 'PLAYLISTER_DB_USER'),
        database_password=param(args.db_password, 'PLAYLISTER_DB_PASSWORD'),
        database_name=param(args.db_name, 'PLAYLISTER_DB_NAME')
        ).run())

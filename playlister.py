import argparse
import datetime
import loguru
import os
import sys

import playlister


def parse_date(date_str):
    try:
        return datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        raise argparse.ArgumentTypeError("Invalid date format, expected YYYY-MM-DD")


def param(arg, env_var, default=None):
    if val := os.environ.get(env_var):
        return val
    if arg is not None:
        return arg
    if default is not None:
        return default

    raise ValueError(f"Neither argument not environment variable '{env_var}' set and no default provided")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Playlister daemon')
    parser.add_argument('--log-level', help='Log level, info by default', choices=['trace', 'debug', 'info', 'warning', 'error', 'critical'])
    parser.add_argument('--db-host', help='Database host')
    parser.add_argument('--db-port', type=int, help='Database port', default=5432)
    parser.add_argument('--db-user', help='Database user')
    parser.add_argument('--db-password', help='Database password')
    parser.add_argument('--db-name', help='Database name')

    parser.add_argument('--sync-date-end', action='store', help='End date for sync', type=parse_date, required=False)
    parser.add_argument('--sync-date-start', action='store', help='Start date for sync',  type=parse_date, required="--sync-date-end" in sys.argv)

    args = parser.parse_args()

    loguru.logger.remove()
    loguru.logger.add(sys.stderr, level=param(args.log_level, 'PLAYLISTER_LOG_LEVEL', 'info').upper())

    daemon = playlister.PlaylisterDaemon(database_host=param(args.db_host, 'PLAYLISTER_DB_HOST'),
                                         database_port=param(args.db_port, 'PLAYLISTER_DB_PORT', 5432),
                                         database_user=param(args.db_user, 'PLAYLISTER_DB_USER'),
                                         database_password=param(args.db_password, 'PLAYLISTER_DB_PASSWORD'),
                                         database_name=param(args.db_name, 'PLAYLISTER_DB_NAME'))

    if args.sync_date_start is None and args.sync_date_end is None:
        sys.exit(daemon.run())
    elif args.sync_date_start is not None:
        sys.exit(daemon.sync(args.sync_date_start, args.sync_date_end))
    else:
        raise argparse.ArgumentTypeError("End date for sync provided without start date")

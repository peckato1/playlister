import argparse
import loguru
import os
import sys

import playlister


def env(key, default=None):
    val = os.environ.get(key)
    if val is None and default is None:
        raise ValueError(f'Environment variable {key} not set')
    return val if val != None else default


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Playlister daemon')
    parser.add_argument('--log-level', default='INFO', help='Log level', choices=['TRACE', 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'])
    args = parser.parse_args()

    loguru.logger.remove()
    loguru.logger.add(sys.stderr, level=args.log_level)

    sys.exit(playlister.PlaylisterDaemon(
        database_host=env('DATABASE_HOST', 'localhost'),
        database_port=env('DATABASE_PORT', 5432),
        database_user=env('DATABASE_USER'),
        database_password=env('DATABASE_PASSWORD'),
        database_name=env('DATABASE_NAME')
        ).run())

#!/usr/bin/env sh

fastapi run ./playlister/api/__init__.py --root-path /api &
nginx
python3 ./playlister.py

echo "done"

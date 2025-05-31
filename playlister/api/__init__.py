import fastapi
import os
import peewee_async

import playlister.model
from .v1.main import router as v1


def create_app():
    app = fastapi.FastAPI(redirect_slashes=False)
    app.include_router(v1, prefix="/v1")
    return app


db = peewee_async.PooledPostgresqlDatabase(
        os.environ['PLAYLISTER_DB_NAME'],
        user=os.environ['PLAYLISTER_DB_USER_READONLY'],
        password=os.environ['PLAYLISTER_DB_PASSWORD_READONLY'],
        host=os.environ['PLAYLISTER_DB_HOST'],
        port=os.environ['PLAYLISTER_DB_PORT'])
playlister.model.bind_models(db)
app = create_app()

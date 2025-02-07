import peewee
import unittest

from playlister import model
from playlister.model import Station, Loader


class DBTest(unittest.TestCase):
    def setUp(self):
        self.db = peewee.PostgresqlDatabase(
            "playlistertest",
            user="postgres",
            password="postgres",
            host="localhost",
            port=5432)

        with self.db:
            self.db.execute_sql('DROP SCHEMA IF EXISTS playlister CASCADE')
            self.db.execute_sql('CREATE SCHEMA playlister')
            self.db.commit()
            model.bind_models(self.db)

            loader = Loader.create(class_name="loader1")
            self.station1 = Station.create(name="station1", loader=loader)
            self.station2 = Station.create(name="station2", loader=loader)

    def tearDown(self):
        with self.db:
            self.db.execute_sql('DROP SCHEMA IF EXISTS playlister CASCADE')
            self.db.commit()

    def assertDbEqual(self, model: model.BaseModel, expected):
        db_entries = list(model.select())
        self.assertEqual(list(map(lambda x: x.__data__, db_entries)), expected)

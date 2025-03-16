import abc
import datetime
from loguru import logger
import peewee

from playlister.daemon.data import Played
from playlister.daemon.persist import DatabaseWriter
from playlister import model


class Loader(metaclass=abc.ABCMeta):
    interval: datetime.timedelta | None = None

    class LoaderException(Exception):
        pass

    def __init__(self, station: model.Station, interval: datetime.timedelta | None, **kwargs):
        self.station = station
        self.interval = interval

    @classmethod
    def create(cls, cls_name, station, interval, *args, **kwargs):
        for subcls in cls.__subclasses__():
            if subcls.__name__ == cls_name:
                return subcls(station, interval, *args, **kwargs)
        raise ValueError(f"No Loader subclass with name '{cls_name}'")

    def fetch(self, day: datetime.date, fetch_yesterday: bool) -> list[Played]:
        raise NotImplementedError()

    def fetch_and_persist(self, db: peewee.Database, day: datetime.date, fetch_yesterday: bool):
        sync_time = datetime.datetime.now()

        tracks = self.fetch(day, fetch_yesterday)
        logger.debug(f'Fetched {len(tracks)} tracks from {self.station.name}')

        dbwriter = DatabaseWriter(db, self.station)
        dbwriter.write(sync_time, tracks)

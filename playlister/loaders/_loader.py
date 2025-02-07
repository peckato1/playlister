import abc
import datetime
from loguru import logger

from playlister.data import Played
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

    def fetch(self, dt: datetime.datetime) -> list[Played]:
        raise NotImplementedError()

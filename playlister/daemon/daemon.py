import datetime
from loguru import logger
import peewee
import sched
import time
import threading

from .loaders import Loader
from .. import model


class PlaylisterDaemon:
    DEFAULT_FETCH_INTERVAL = datetime.timedelta(minutes=5)

    def __init__(self, database_host, database_port, database_user, database_password, database_name):
        self.db = peewee.PostgresqlDatabase(
            database_name,
            user=database_user,
            password=database_password,
            host=database_host,
            port=database_port)
        self.scheduler = sched.scheduler(time.time, time.sleep)
        self.loaders = list()

    @classmethod
    def _create_loader(cls, station: model.Station):
        params = model.LoaderParams.select().where(model.LoaderParams.station == station)
        params = dict(map(lambda p: (p.key, p.value), list(params)))

        loader = Loader.create(station.loader_class, station, station.loader_interval, **params)
        logger.info(f'Initialized loader {loader.__class__.__name__} for station {station.name}, interval {loader.interval}')
        return loader

    def run(self):
        with self.db:
            model.bind_models(self.db)
            self.loaders = list(map(lambda s: self._create_loader(s), model.Station.select().execute()))

        for loader in self.loaders:
            self.scheduler.enter(1, 0, self._loader_fetch, (loader,))

        self.thread = threading.Thread(target=self.scheduler.run)
        self.thread.start()
        self.thread.join()
        return 0

    def _schedule_next(self, loader: Loader, sync_time: datetime.datetime):
        if loader.interval is None:
            interval = self.DEFAULT_FETCH_INTERVAL
        else:
            interval = loader.interval

        next_sync_time = sync_time + interval
        logger.debug(f'Scheduling next fetch for {loader.station.name} at {next_sync_time} ({interval} from now)')
        self.scheduler.enter(interval.total_seconds(), 0, self._loader_fetch, (loader,))

    def _loader_fetch(self, loader: Loader):
        now = datetime.datetime.now()

        try:
            loader.fetch_and_persist(self.db, now.date())
        except Loader.LoaderException as e:
            logger.exception(f'Failed to fetch data from {loader.station.name}: {e}')
        except Exception as e:
            logger.exception(f'Unexpected error while fetching data from {loader.station.name}: {e}')

        self._schedule_next(loader, now)

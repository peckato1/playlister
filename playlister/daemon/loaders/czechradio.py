import datetime
import requests

from ._loader import Loader
from playlister.model import Station
from playlister.daemon.data import Played


class CzechRadioLoader(Loader):
    URL_TEMPLATE = 'https://api.rozhlas.cz/data/v2/playlist/day/{:04d}/{:02d}/{:02d}/{}.json'

    def __init__(self, station: Station, interval: datetime.timedelta | None, **kwargs):
        super().__init__(station, interval, **kwargs)
        self.station_url = kwargs['stationname']

    def fetch(self, dt: datetime.datetime):
        # Czech Radio API uses date only, fetch data for previous day too so we don't miss anything at midnight

        entries = []
        for date in [dt - datetime.timedelta(days=1), dt]:
            url = self.URL_TEMPLATE.format(date.year, date.month, date.day, self.station_url)

            r = requests.get(url)
            try:
                r.raise_for_status()
            except requests.exceptions.HTTPError as e:
                raise Loader.LoaderException(f'Failed to fetch data from {url}') from e

            for e in r.json()['data']:
                entries.append(Played(
                    start=datetime.datetime.fromisoformat(e['since']),
                    interpret_name=e['interpret'],
                    track_name=e['track'],
                    interpret_meta=dict(czechradio_id=e['interpret_id']),
                    track_meta=dict(czechradio_id=e['track_id'])))

        return entries

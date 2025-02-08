import dataclasses
import datetime
import json
import os
import pathlib
import re
import unittest
import unittest.mock

import playlister.daemon.loaders as loaders
import playlister.daemon.data as data


def mock_requests_get(url, *args, **kwargs):
    class MockResponse:
        def __init__(self, file: str, status_code):
            self.json_data = self.read_file(file)
            self.status_code = status_code

        @staticmethod
        def read_file(file: str):
            path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
            path = path / "resources" / "czechradio" / file
            with open(path) as f:
                return f.read()

        def json(self):
            return json.loads(self.json_data)

        def raise_for_status(self):
            pass

    m = re.match(r'https://api.rozhlas.cz/data/v2/playlist/day/(\d{4})/(\d{2})/(\d{2})/(\w+).json', url)
    if not m:
        raise ValueError(f'Unexpected URL {url}')

    year, month, day, station = m.groups()
    return MockResponse(f'{station}.{year}{month}{day}.json', 200)

class TestLoaderCzechRadio(unittest.TestCase):
    @dataclasses.dataclass
    class StationMock:
        id: int
        name: str

    @unittest.mock.patch('requests.get', side_effect=mock_requests_get)
    def test_fetch(self, mock_get):
        loader = loaders.Loader.create('CzechRadioLoader',
                                       station=self.StationMock(1, 'radiozurnal'),
                                       interval=None,
                                       stationname='radiozurnal')
        loaded = loader.fetch(datetime.datetime(2025, 2, 7))

        self.assertEqual(loaded, [
            data.Played(
                start=datetime.datetime(2025, 2, 6, 0, 38, 2, tzinfo=datetime.timezone(datetime.timedelta(seconds=3600))),
                interpret_name='P!NK',
                track_name='WHAT ABOUT US',
                interpret_meta={'czechradio_id': 3225},
                track_meta={'czechradio_id': 43765}),
            data.Played(
                start=datetime.datetime(2025, 2, 6, 0, 41, 55, tzinfo=datetime.timezone(datetime.timedelta(seconds=3600))),
                interpret_name='CHINASKI',
                track_name='STEJNĚ JAKO JÁ',
                interpret_meta={'czechradio_id': 2987},
                track_meta={'czechradio_id': 14056}),
            data.Played(
                start=datetime.datetime(2025, 2, 6, 0, 44, 17, tzinfo=datetime.timezone(datetime.timedelta(seconds=3600))),
                interpret_name='MIKOLAS JOSEF',
                track_name='LULLABY',
                interpret_meta={'czechradio_id': 14387},
                track_meta={'czechradio_id': 115514}),
            data.Played(
                start=datetime.datetime(2025, 2, 7, 0, 38, 5, tzinfo=datetime.timezone(datetime.timedelta(seconds=3600))),
                interpret_name='R.E.M.',
                track_name='IMITATION OF LIFE',
                interpret_meta={'czechradio_id': 2988},
                track_meta={'czechradio_id': 7535}),
            data.Played(
                start=datetime.datetime(2025, 2, 7, 1, 41, 55, tzinfo=datetime.timezone(datetime.timedelta(seconds=3600))),
                interpret_name='CHINASKI',
                track_name='STEJNĚ JAKO JÁ',
                interpret_meta={'czechradio_id': 2987},
                track_meta={'czechradio_id': 14056})
            ])

        self.assertEqual(mock_get.call_args_list, [
            unittest.mock.call('https://api.rozhlas.cz/data/v2/playlist/day/2025/02/06/radiozurnal.json'),
            unittest.mock.call('https://api.rozhlas.cz/data/v2/playlist/day/2025/02/07/radiozurnal.json')
            ])

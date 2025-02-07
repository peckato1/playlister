import datetime

from playlister import model, data
from playlister.persist import DatabaseWriter
from tests.DBTest import DBTest


def tz(dt, tzdiff):
    return dt.replace(tzinfo=datetime.timezone(datetime.timedelta(seconds=tzdiff)))


class TestPersisting(DBTest):
    sync_time = tz(datetime.datetime(2020, 1, 1, 12, 11, 12), 3600)

    def test_writeEmptyDb(self):
        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time, [data.Played(
            start=self.sync_time - datetime.timedelta(minutes=5),
            interpret_name="I",
            interpret_meta={"m1": "v1", "m2": "v2"},
            track_name="T",
            track_meta={"m3": "v3"})])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=5),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }])
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "I"
        }])
        self.assertDbEqual(model.InterpretMetadata, [
            {'interpret': 1, 'key': 'm1', 'value': 'v1'},
            {'interpret': 1, 'key': 'm2', 'value': 'v2'}
        ])
        self.assertDbEqual(model.Track, [{
            'id': 1,
            'name': "T",
            'interpret': 1
        }])
        self.assertDbEqual(model.TrackMetadata, [
            {'track': 1, 'key': 'm3', 'value': 'v3'},
        ])

        # second scrape
        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time + datetime.timedelta(hours=1), [
            data.Played(
                start=self.sync_time + datetime.timedelta(minutes=50),
                interpret_name="I",
                track_name="T"),
            data.Played(
                start=self.sync_time + datetime.timedelta(minutes=55),
                interpret_name="I",
                track_name="T2"),
            data.Played(
                start=self.sync_time + datetime.timedelta(minutes=58),
                interpret_name="I2",
                track_name="T3")
        ])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=5),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }, {
            'start': self.sync_time + datetime.timedelta(minutes=50),
            'station': 1,
            'synced_at': self.sync_time + datetime.timedelta(hours=1),
            'track': 1
        }, {
            'start': self.sync_time + datetime.timedelta(minutes=55),
            'station': 1,
            'synced_at': self.sync_time + datetime.timedelta(hours=1),
            'track': 2
        }, {
            'start': self.sync_time + datetime.timedelta(minutes=58),
            'station': 1,
            'synced_at': self.sync_time + datetime.timedelta(hours=1),
            'track': 3
        }])
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "I"
        }, {
            'id': 2,
            'name': "I2"
        }])
        self.assertDbEqual(model.Track, [{
            'id': 1,
            'name': "T",
            'interpret': 1
        }, {
            'id': 2,
            'name': "T2",
            'interpret': 1
        }, {
            'id': 3,
            'name': "T3",
            'interpret': 2
        }])

    def testCaseInsensitivity(self):
        model.Interpret.create(name="Inter Peter and the Testers")
        model.Track.create(name="Track suit", interpret=1)
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "Inter Peter and the Testers"
        }])
        self.assertDbEqual(model.Track, [{
            'id': 1,
            'name': "Track suit",
            'interpret': 1
        }])

        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time, [data.Played(
            start=self.sync_time - datetime.timedelta(minutes=1),
            interpret_name="inter peter And The Testers",
            track_name="track suit")])
        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }])
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "Inter Peter and the Testers"
        }])
        self.assertDbEqual(model.Track, [{
            'id': 1,
            'name': "Track suit",
            'interpret': 1
        }])

    def test_writeInterpretExists(self):
        model.Interpret.create(name="i")
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "i"
        }])
        self.assertDbEqual(model.InterpretMetadata, [])

        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time, [data.Played(
            start=self.sync_time - datetime.timedelta(minutes=1),
            interpret_name="I",
            interpret_meta={"m1": "v1", "m2": "v2"},
            track_name="T",
            track_meta={"m3": "v3"})])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }])
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "i"
        }])
        self.assertDbEqual(model.InterpretMetadata, [
            {'interpret': 1, 'key': 'm1', 'value': 'v1'},
            {'interpret': 1, 'key': 'm2', 'value': 'v2'}
        ])

    def test_writeInterpretExistsMetadata(self):
        model.Interpret.create(name="I")
        model.InterpretMetadata.create(interpret=1, key="m1", value="v1")
        model.InterpretMetadata.create(interpret=1, key="m2", value="v2")
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "I"
        }])
        self.assertDbEqual(model.InterpretMetadata, [
            {'interpret': 1, 'key': 'm1', 'value': 'v1'},
            {'interpret': 1, 'key': 'm2', 'value': 'v2'}
        ])

        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time, [data.Played(start=self.sync_time - datetime.timedelta(minutes=1),
                        interpret_name="I",
                        interpret_meta={"m1": "v1"},
                        track_name="T",
                        track_meta={"m3": "v3"})])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }])
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "I"
        }])
        self.assertDbEqual(model.InterpretMetadata, [
            {'interpret': 1, 'key': 'm1', 'value': 'v1'},
            {'interpret': 1, 'key': 'm2', 'value': 'v2'}
        ])

        # different metadata on next scrape
        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time + datetime.timedelta(hours=1),
                       [data.Played(start=self.sync_time + datetime.timedelta(minutes=50),
                        interpret_name="I",
                        interpret_meta={"m1": "v1"},
                        track_name="T",
                        track_meta={"m4": "v4"})])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }, {
            'start': self.sync_time + datetime.timedelta(minutes=50),
            'station': 1,
            'synced_at': self.sync_time + datetime.timedelta(hours=1),
            'track': 1
        }])
        self.assertDbEqual(model.Interpret, [{
            'id': 1,
            'name': "I"
        }])
        self.assertDbEqual(model.InterpretMetadata, [
            {'interpret': 1, 'key': 'm1', 'value': 'v1'},
            {'interpret': 1, 'key': 'm2', 'value': 'v2'}
        ])
        self.assertDbEqual(model.Track, [{
            'id': 1,
            'name': "T",
            'interpret': 1
        }])
        self.assertDbEqual(model.TrackMetadata, [
            {'track': 1, 'key': 'm3', 'value': 'v3'},
            {'track': 1, 'key': 'm4', 'value': 'v4'}
        ])

    def test_multipleStations(self):
        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time, [data.Played(
            start=self.sync_time - datetime.timedelta(minutes=1),
            interpret_name="I",
            track_name="T")])

        dbwriter = DatabaseWriter(self.db, self.station2)
        dbwriter.write(self.sync_time, [data.Played(
            start=self.sync_time - datetime.timedelta(minutes=1),
            interpret_name="I",
            track_name="T")])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 1,
            'synced_at': self.sync_time,
            'track': 1
        }, {
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 2,
            'synced_at': self.sync_time,
            'track': 1
        }])

    def test_multipleScrapesOfSameEntry(self):
        dbwriter = DatabaseWriter(self.db, self.station1)
        dbwriter.write(self.sync_time,
                       [data.Played(
                            start=self.sync_time - datetime.timedelta(minutes=1),
                            interpret_name="I",
                            track_name="T")])
        dbwriter.write(self.sync_time + datetime.timedelta(hours=1),
                       [data.Played(
                           start=self.sync_time - datetime.timedelta(minutes=1),
                           interpret_name="I",
                           track_name="T"),
                        data.Played(
                            start=self.sync_time + datetime.timedelta(minutes=5),
                            interpret_name="I",
                            track_name="T")])

        self.assertDbEqual(model.TrackPlayed, [{
            'start': self.sync_time - datetime.timedelta(minutes=1),
            'station': 1,
            'synced_at': self.sync_time, # must preserve the first sync time
            'track': 1
        }, {
            'start': self.sync_time + datetime.timedelta(minutes=5),
            'station': 1,
            'synced_at': self.sync_time + datetime.timedelta(hours=1),
            'track': 1
        }])

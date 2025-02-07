import datetime
from loguru import logger
from playlister import model, data


def createMetadata(metadata_cls, instance: model.BaseModel, meta: dict):
    if metadata_cls == model.InterpretMetadata:
        fk_column = 'interpret'
    elif metadata_cls == model.TrackMetadata:
        fk_column = 'track'
    else:
        raise ValueError("Unknown metadata class")

    metadata_cls.insert_many([{
        'key': key,
        'value': value,
        fk_column: instance.id
    } for key, value in meta.items()]).on_conflict_ignore().execute() # TODO Really ignore? At least warn when conflicts (fk, key) -> value happen


class DatabaseWriter:
    def __init__(self, db, station: model.Station):
        self.db = db
        self.station = station

    def write(self, sync_time: datetime.datetime, tracks: list[data.Played]):
        with self.db.atomic():
            for entry in tracks:
                self._persist_entry(entry, sync_time)

    def _persist_entry(self, entry, sync_time):
        interpret = self._find_interpret(entry.interpret_name, meta=entry.interpret_meta)
        track = self._find_track(interpret, entry.track_name, meta=entry.track_meta)
        model.TrackPlayed.get_or_create(track_id=track.id, start=entry.start, station=self.station, defaults={'synced_at': sync_time})

    def _find_interpret(self, name: str, meta=None):
        if meta is None:
            meta = dict()

        try:
            logger.trace(f"Querying for interpret '{name}'")
            resultset = model.Interpret.select().where(model.Interpret.name ** name)
            logger.trace(f" - {resultset.sql()}")
            logger.trace(f' - Found {len(resultset)} results')

            if len(resultset) == 0:
                raise model.Interpret.DoesNotExist
            if len(resultset) > 1:
                raise RuntimeError(f"Multiple interprets found")

            m = resultset[0]
        except model.Interpret.DoesNotExist:
            logger.trace(f"Creating interpret '{name}'")
            m = model.Interpret.create(name=name)

        createMetadata(model.InterpretMetadata, m, meta)
        return m

    def _find_track(self, interpret: model.Interpret, name: str, meta=None):
        if meta is None:
            meta = dict()

        try:
            logger.trace(f"Querying for track '{name}' by '{interpret.name}'")
            resultset = model.Track.select().where(model.Track.name ** name, model.Track.interpret == interpret)
            logger.trace(f" - {resultset.sql()}")
            logger.trace(f' - Found {len(resultset)} results')

            if len(resultset) == 0:
                raise model.Track.DoesNotExist
            if len(resultset) > 1:
                raise RuntimeError(f"Multiple tracks found")

            m = resultset[0]
        except model.Track.DoesNotExist:
            logger.trace(f"Creating track '{name}' by '{interpret.name}'")
            m = model.Track.create(name=name, interpret=interpret)

        createMetadata(model.TrackMetadata, m, meta)
        return m

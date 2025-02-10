import peewee
import playhouse.postgres_ext


class BaseModel(peewee.Model):
    class Meta:
        schema = 'playlister'


class Station(BaseModel):
    id = peewee.AutoField(primary_key=True)
    name = peewee.CharField(unique=True)
    loader_class = peewee.CharField()
    loader_interval = playhouse.postgres_ext.IntervalField(null=True)  # Default daemon interval if not set by loader


class LoaderParams(BaseModel):
    station = peewee.ForeignKeyField(Station, backref='loader_params', column_name='station_id')
    key = peewee.CharField()
    value = peewee.CharField()

    class Meta:
        primary_key = False
        indexes = (
            (('station', 'key'), True),
        )


class Interpret(BaseModel):
    id = peewee.AutoField(primary_key=True)
    name = peewee.CharField(index=True)


class InterpretMetadata(BaseModel):
    interpret = peewee.ForeignKeyField(Interpret, backref='metadata', column_name='interpret_id')
    key = peewee.CharField()
    value = peewee.CharField()

    class Meta:
        primary_key = False
        indexes = (
            (('interpret_id', 'key'), True),
        )


class Track(BaseModel):
    id = peewee.AutoField(primary_key=True)
    name = peewee.CharField(index=True)
    interpret = peewee.ForeignKeyField(Interpret, backref='tracks', column_name='interpret_id')


class TrackMetadata(BaseModel):
    track = peewee.ForeignKeyField(Track, backref='metadata', column_name='track_id')
    key = peewee.CharField()
    value = peewee.CharField()

    class Meta:
        primary_key = False
        indexes = (
            (('track_id', 'key'), True),
        )


class TrackPlayed(BaseModel):
    start = playhouse.postgres_ext.DateTimeTZField(index=True)
    station = peewee.ForeignKeyField(Station, backref='played', column_name='station_id')
    track = peewee.ForeignKeyField(Track, backref='played', column_name='track_id')
    synced_at = playhouse.postgres_ext.DateTimeTZField()

    class Meta:
        primary_key = peewee.CompositeKey('station', 'start')


def bind_models(database):
    database.bind([Station, LoaderParams, Interpret, InterpretMetadata, Track, TrackMetadata, TrackPlayed])
    database.create_tables([Station, LoaderParams, Interpret, InterpretMetadata, Track, TrackMetadata, TrackPlayed])

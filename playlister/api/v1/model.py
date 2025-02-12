import datetime
import pydantic


class Station(pydantic.BaseModel):
    id: int
    name: str
    loader_interval: datetime.timedelta | None


class Interpret(pydantic.BaseModel):
    id: int
    name: str


class Track(pydantic.BaseModel):
    id: int
    name: str
    interpret: Interpret


class TrackPlayed(pydantic.BaseModel):
    start: datetime.datetime
    synced_at: datetime.datetime
    station: Station
    track: Track

import datetime
import pydantic
import typing


T = typing.TypeVar("T")


class Station(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(ser_json_timedelta='float')

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


class PaginatedResponseMeta(pydantic.BaseModel):
    total: int
    page: int
    last_page: int
    limit: int


class PaginatedResponse(pydantic.BaseModel, typing.Generic[T]):
    pagination: PaginatedResponseMeta | None
    data: typing.List[T]

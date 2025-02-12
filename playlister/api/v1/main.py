import fastapi
import os
import peewee
import peewee_async
import typing

import playlister.model as m
from . import model as apimodel


router = fastapi.APIRouter(
    tags=["v1"],
    responses={404: {"description": "Not found"}},
)


def pagination(limit: int = 500, page: int = 1) -> dict:
    return {"limit": limit, "page": page}


def station_id_filter(station_id: typing.List[int] = fastapi.Query(None)):
    return station_id


Pagination = typing.Annotated[dict, fastapi.Depends(pagination)]
StationIdFilter = typing.Annotated[list, fastapi.Depends(station_id_filter)]


def paginate(pagination: Pagination, query):
    return list(query.paginate(pagination["page"], pagination["limit"]))


def filter_stations(stationIdFilter: StationIdFilter, query: peewee.ModelSelect):
    if stationIdFilter:
        return query.where(m.TrackPlayed.station.in_(stationIdFilter))
    return query


@router.get("/stations")
async def stations() -> typing.List[apimodel.Station]:
    return list(m.Station.select())


@router.get("/stations/{station_id}")
async def station(station_id: int) -> apimodel.Station:
    return m.Station.get(m.Station.id == station_id)


@router.get("/stations/{station_id}/played")
async def station_played(station_id: int, p: Pagination) -> typing.List[apimodel.TrackPlayed]:
    return paginate(p, m.TrackPlayed.select().where(m.TrackPlayed.station == station_id).order_by(m.TrackPlayed.start.desc()))


@router.get("/interprets")
async def interprets(p: Pagination) -> typing.List[apimodel.Interpret]:
    return paginate(p, m.Interpret.select())


@router.get("/interprets/{interpret_id}")
async def interpret(interpret_id: int) -> apimodel.Interpret:
    return m.Interpret.get(m.Interpret.id == interpret_id)


@router.get("/interprets/{interpret_id}/tracks")
async def interpret_tracks(interpret_id: int, p: Pagination) -> typing.List[apimodel.Track]:
    return paginate(p, m.Track.select().where(m.Track.interpret == interpret_id))


@router.get("/interprets/{interpret_id}/played")
async def interpret_played(interpret_id: int, p: Pagination, station_filter: StationIdFilter) -> typing.List[apimodel.TrackPlayed]:
    q = m.TrackPlayed.select().join(m.Track).where(m.Track.interpret == interpret_id)
    return paginate(p, filter_stations(station_filter, q).order_by(m.TrackPlayed.start.desc()))


@router.get("/tracks")
async def tracks(p: Pagination) -> typing.List[apimodel.Track]:
    return paginate(p, m.Track.select(m.Track, m.Interpret).join(m.Interpret))


@router.get("/tracks/{track_id}")
async def track(track_id: int) -> apimodel.Track:
    return m.Track.select(m.Track, m.Interpret.id.alias("interpret_id"), m.Interpret.name.alias("interpret_name"))\
            .join(m.Interpret).objects().where(m.Track.id == track_id).objects().get()

@router.get("/tracks/{track_id}/played")
async def track_played(track_id: int, p: Pagination, station_filter: StationIdFilter) -> typing.List[apimodel.TrackPlayed]:
    q = m.TrackPlayed.select().where(m.TrackPlayed.track == track_id)
    return paginate(p, filter_stations(station_filter, q).order_by(m.TrackPlayed.start.desc()))

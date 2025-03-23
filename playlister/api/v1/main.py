import fastapi
import math
import peewee
import typing

import playlister.model as m
from . import model as apimodel


router = fastapi.APIRouter(
    tags=["v1"],
    responses={404: {"description": "Not found"}},
)


def pagination(limit: int = 500, page: int = 1) -> dict:
    return {"limit": limit, "page": page}


def station_filter(station_id: typing.List[int] = fastapi.Query(None)):
    return station_id


Pagination = typing.Annotated[dict, fastapi.Depends(pagination)]
StationFilter = typing.Annotated[list, fastapi.Depends(station_filter)]


def paginate(pagination: Pagination, query) -> apimodel.PaginatedResponse:
    total_count = query.count()

    return apimodel.PaginatedResponse(
        data=list(query.paginate(pagination["page"], pagination["limit"])),
        pagination=apimodel.PaginatedResponseMeta(
            limit=pagination["limit"],
            page=pagination["page"],
            last_page=math.ceil(total_count / pagination["limit"]),
            total=total_count,
        ),
    )


def filter_stations(station_ids: StationFilter, query: peewee.ModelSelect):
    if station_ids:
        return query.where(m.TrackPlayed.station.in_(station_ids))
    return query


@router.get("/played")
async def played(p: Pagination) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return paginate(p, m.TrackPlayed.select().order_by(m.TrackPlayed.start.desc()))


@router.get("/stations")
async def stations(p: Pagination) -> apimodel.PaginatedResponse[apimodel.Station]:
    return paginate(p, m.Station.select())


@router.get("/stations/{station_id}")
async def station(station_id: int) -> apimodel.Station:
    return m.Station.get(m.Station.id == station_id)


@router.get("/stations/{station_id}/played")
async def station_played(station_id: int, p: Pagination) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return paginate(p, m.TrackPlayed.select().where(m.TrackPlayed.station == station_id).order_by(m.TrackPlayed.start.desc()))


@router.get("/interprets")
async def interprets(p: Pagination) -> apimodel.PaginatedResponse[apimodel.Interpret]:
    return paginate(p, m.Interpret.select())


@router.get("/interprets/{interpret_id}")
async def interpret(interpret_id: int) -> apimodel.Interpret:
    return m.Interpret.get(m.Interpret.id == interpret_id)


@router.get("/interprets/{interpret_id}/tracks")
async def interpret_tracks(interpret_id: int, p: Pagination) -> apimodel.PaginatedResponse[apimodel.Track]:
    return paginate(p, m.Track.select().where(m.Track.interpret == interpret_id))


@router.get("/interprets/{interpret_id}/played")
async def interpret_played(interpret_id: int, p: Pagination, stations: StationFilter) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    q = m.TrackPlayed.select().join(m.Track).where(m.Track.interpret == interpret_id)
    return paginate(p, filter_stations(stations, q).order_by(m.TrackPlayed.start.desc()))


@router.get("/tracks")
async def tracks(p: Pagination) -> apimodel.PaginatedResponse[apimodel.Track]:
    return paginate(p, m.Track.select(m.Track, m.Interpret).join(m.Interpret))


@router.get("/tracks/{track_id}")
async def track(track_id: int) -> apimodel.Track:
    return m.Track.select(m.Track, m.Interpret.id.alias("interpret_id"), m.Interpret.name.alias("interpret_name"))\
            .join(m.Interpret).objects().where(m.Track.id == track_id).objects().get()


@router.get("/tracks/{track_id}/played")
async def track_played(track_id: int, p: Pagination, stations: StationFilter) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    q = m.TrackPlayed.select().where(m.TrackPlayed.track == track_id)
    return paginate(p, filter_stations(stations, q).order_by(m.TrackPlayed.start.desc()))

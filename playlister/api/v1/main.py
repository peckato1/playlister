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


class PaginationQ:
    def __init__(self, limit: int = 500, page: int = 1):
        self.limit = limit
        self.page = page

    def __call__(self, query) -> apimodel.PaginatedResponse:
        total_count = query.count()

        return apimodel.PaginatedResponse(
            data=list(query.paginate(self.page, self.limit)),
            pagination=apimodel.PaginatedResponseMeta(
                limit=self.limit,
                page=self.page,
                last_page=math.ceil(total_count / self.limit),
                total=total_count,
            ),
        )


class StationFilterQ:
    def __init__(self, station_ids: typing.List[int] = fastapi.Query(None)):
        self.stations = station_ids if station_ids else []

    def __call__(self, query):
        if len(self.stations) > 0:
            return query.where(m.TrackPlayed.station.in_(self.stations))
        return query


Pagination = typing.Annotated[PaginationQ, fastapi.Depends(PaginationQ)]
StationFilter = typing.Annotated[StationFilterQ, fastapi.Depends(StationFilterQ)]


@router.get("/played")
async def played(pagination: Pagination, stations: StationFilter) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(stations(m.TrackPlayed
                               .select(m.TrackPlayed, m.Track, m.Interpret, m.Station)
                               .join(m.Station)
                               .switch(m.TrackPlayed)
                               .join(m.Track)
                               .join(m.Interpret)
                               .order_by(m.TrackPlayed.start.desc())))


@router.get("/stations")
async def stations(pagination: Pagination) -> apimodel.PaginatedResponse[apimodel.Station]:
    return pagination(m.Station.select())


@router.get("/stations/{station_id}")
async def station(station_id: int) -> apimodel.Station:
    return m.Station.get(m.Station.id == station_id)


@router.get("/stations/{station_id}/played")
async def station_played(station_id: int, pagination: Pagination) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(m.TrackPlayed
                      .select(m.TrackPlayed, m.Track, m.Interpret, m.Station)
                      .where(m.TrackPlayed.station == station_id)
                      .join(m.Station)
                      .switch(m.TrackPlayed)
                      .join(m.Track)
                      .join(m.Interpret)
                      .order_by(m.TrackPlayed.start.desc()))


@router.get("/interprets")
async def interprets(pagination: Pagination) -> apimodel.PaginatedResponse[apimodel.Interpret]:
    return pagination(m.Interpret.select())


@router.get("/interprets/{interpret_id}")
async def interpret(interpret_id: int) -> apimodel.Interpret:
    return m.Interpret.get(m.Interpret.id == interpret_id)


@router.get("/interprets/{interpret_id}/tracks")
async def interpret_tracks(interpret_id: int, pagination: Pagination) -> apimodel.PaginatedResponse[apimodel.Track]:
    return pagination(m.Track
                      .select(m.Track, m.Interpret)
                      .join(m.Interpret)
                      .where(m.Track.interpret == interpret_id))


@router.get("/interprets/{interpret_id}/played")
async def interpret_played(interpret_id: int, pagination: Pagination, stations: StationFilter) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(stations(m.TrackPlayed
                               .select(m.TrackPlayed, m.Track, m.Interpret, m.Station)
                               .join(m.Track)
                               .where(m.Track.interpret == interpret_id)
                               .join(m.Interpret)
                               .switch(m.TrackPlayed)
                               .join(m.Station)
                               .order_by(m.TrackPlayed.start.desc())))

@router.get("/tracks")
async def tracks(pagination: Pagination) -> apimodel.PaginatedResponse[apimodel.Track]:
    return pagination(m.Track.select(m.Track, m.Interpret).join(m.Interpret))


@router.get("/tracks/{track_id}")
async def track(track_id: int) -> apimodel.Track:
    return m.Track.select(m.Track, m.Interpret).where(m.Track.id == track_id).join(m.Interpret).get()


@router.get("/tracks/{track_id}/played")
async def track_played(track_id: int, pagination: Pagination, stations: StationFilter) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(stations(m.TrackPlayed
                               .select(m.TrackPlayed, m.Station, m.Track, m.Interpret)
                               .where(m.TrackPlayed.track == track_id)
                               .join(m.Station)
                               .switch(m.TrackPlayed)
                               .join(m.Track)
                               .join(m.Interpret)
                               .order_by(m.TrackPlayed.start.desc())))

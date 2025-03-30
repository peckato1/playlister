import fastapi
import functools
import math
import peewee
import typing

import playlister.model as m
from . import model as apimodel
from . import grammars


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


class SearchSortQ:
    def __init__(self, query: str = fastapi.Query(None), sort: str = fastapi.Query(None)):
        try:
            self.whereCond = grammars.parseSearchQ(query)
            self.orderByCond = grammars.parseSortQ(sort)
        except ValueError:
            raise fastapi.HTTPException(status_code=500,
                                        detail=f"Invalid syntax for query parameter ('{query}')")

    def __call__(self, query):
        if self.whereCond:
            query = query.where(self.whereCond)
        if self.orderByCond:
            query = query.order_by(*self.orderByCond)
        return query


Pagination = typing.Annotated[PaginationQ, fastapi.Depends(PaginationQ)]
SearchSort = typing.Annotated[SearchSortQ, fastapi.Depends(SearchSortQ)]


@router.get("/played")
async def played(pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(search(m.TrackPlayed
                             .select(m.TrackPlayed, m.Track, m.Interpret, m.Station)
                             .join(m.Station)
                             .switch(m.TrackPlayed)
                             .join(m.Track)
                             .join(m.Interpret)
                             .order_by(m.TrackPlayed.start.desc())))


@router.get("/stations")
async def stations(pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.Station]:
    return pagination(search(m.Station.select()))


@router.get("/stations/{station_id}")
async def station(station_id: int) -> apimodel.Station:
    return m.Station.get(m.Station.id == station_id)


@router.get("/stations/{station_id}/played")
async def station_played(station_id: int, pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(search(m.TrackPlayed
                             .select(m.TrackPlayed, m.Track, m.Interpret, m.Station)
                             .where(m.TrackPlayed.station == station_id)
                             .join(m.Station)
                             .switch(m.TrackPlayed)
                             .join(m.Track)
                             .join(m.Interpret)
                             .order_by(m.TrackPlayed.start.desc())))


@router.get("/interprets")
async def interprets(pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.Interpret]:
    return pagination(search(m.Interpret.select()))


@router.get("/interprets/{interpret_id}")
async def interpret(interpret_id: int) -> apimodel.Interpret:
    return m.Interpret.get(m.Interpret.id == interpret_id)


@router.get("/interprets/{interpret_id}/tracks")
async def interpret_tracks(interpret_id: int, pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.Track]:
    return pagination(search(m.Track
                             .select(m.Track, m.Interpret)
                             .join(m.Interpret)
                             .where(m.Track.interpret == interpret_id)))


@router.get("/interprets/{interpret_id}/played")
async def interpret_played(interpret_id: int, pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(search(m.TrackPlayed
                             .select(m.TrackPlayed, m.Track, m.Interpret, m.Station)
                             .join(m.Track)
                             .where(m.Track.interpret == interpret_id)
                             .join(m.Interpret)
                             .switch(m.TrackPlayed)
                             .join(m.Station)
                             .order_by(m.TrackPlayed.start.desc())))

@router.get("/tracks")
async def tracks(pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.Track]:
    return pagination(search(m.Track.select(m.Track, m.Interpret).join(m.Interpret)))


@router.get("/tracks/{track_id}")
async def track(track_id: int) -> apimodel.Track:
    return m.Track.select(m.Track, m.Interpret).where(m.Track.id == track_id).join(m.Interpret).get()


@router.get("/tracks/{track_id}/played")
async def track_played(track_id: int, pagination: Pagination, search: SearchSort) -> apimodel.PaginatedResponse[apimodel.TrackPlayed]:
    return pagination(search(m.TrackPlayed
                             .select(m.TrackPlayed, m.Station, m.Track, m.Interpret)
                             .where(m.TrackPlayed.track == track_id)
                             .join(m.Station)
                             .switch(m.TrackPlayed)
                             .join(m.Track)
                             .join(m.Interpret)
                             .order_by(m.TrackPlayed.start.desc())))

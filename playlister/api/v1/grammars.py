import datetime
import enum
import functools
import typing

import lark
import peewee
import playlister.model as m


def field_to_column(field):
    if field == "interpret":
        return m.Interpret.name
    if field == "track":
        return m.Track.name
    if field == "station":
        return m.Station.name
    if field == "start":
        return m.TrackPlayed.start
    raise ValueError(f"Unknown field '{field}'")


def pw_op(op, pw_field, value):
    return peewee.Expression(pw_field, op, f"%{value}%")


class OperatorType(enum.StrEnum):
    ILIKE = peewee.OP.ILIKE
    GT = peewee.OP.GT
    GEQ = peewee.OP.GTE
    LT = peewee.OP.LT
    LEQ = peewee.OP.LTE


class SortOperatorType(enum.StrEnum):
    ASC = enum.auto()
    DESC = enum.auto()


def pw_sortop(op: SortOperatorType, pw_field):
    if op == SortOperatorType.ASC:
        return +pw_field
    elif op == SortOperatorType.DESC:
        return -pw_field
    else:
        raise ValueError(f"Unknown sort operator '{op}'")


class SearchTransformer(lark.Transformer):
    def start(self, children):
        return functools.reduce(lambda prev, e: prev & e, children)

    def field(self, children):
        return field_to_column(children[0].value)

    def item(self, children):
        field, op, value = children
        return pw_op(op, field, value)

    def operator(self, children):
        return OperatorType[children[0].type]

    def datetime(self, children):
        return datetime.datetime.fromisoformat(children[0].value)


class SortTransformer(lark.Transformer):
    def start(self, children):
        return children

    def field(self, children):
        return field_to_column(children[0].value)

    def item_operator(self, children):
        op, value = children
        return pw_sortop(op, value)

    def item(self, children):
        return pw_sortop(SortOperatorType.ASC, children[0])

    def operator(self, children):
        return SortOperatorType[children[0].type]


def parse(grammar_filename: str, transformer_cls: typing.Type[lark.Transformer], inp: str):
    parser = lark.Lark.open(grammar_filename, rel_to=__file__, parser="lalr")

    try:
        tree = parser.parse(inp)
        res = transformer_cls().transform(tree)
        return res
    except (lark.exceptions.UnexpectedToken, lark.exceptions.UnexpectedCharacters) as e:
        raise ValueError("Parser error") from e


def parseSearchQ(s: str | None):
    if not s:
        return None
    return parse("search.lark", SearchTransformer, s)


def parseSortQ(s: str | None):
    if not s:
        return None
    return parse("sort.lark", SortTransformer, s)

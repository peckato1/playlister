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
    ILIKE = enum.auto()


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

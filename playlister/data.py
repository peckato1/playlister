import dataclasses
import datetime


@dataclasses.dataclass
class Played:
    start: datetime.datetime
    track_name: str
    interpret_name: str
    track_meta: dict | None = None
    interpret_meta: dict | None = None

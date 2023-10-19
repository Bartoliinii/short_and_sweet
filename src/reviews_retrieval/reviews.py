from dataclasses import dataclass
from datetime import datetime
from typing import List


@dataclass
class Reviews:
    stars: int
    oldest_review_date: datetime | str
    reviews: List[str]
    thumbs_up_count: List[int]
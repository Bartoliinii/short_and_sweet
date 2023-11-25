from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class Reviews(BaseModel):
    stars: Optional[int]
    oldest_review_date: datetime | str
    reviews: List[str]
    thumbs_up_count: List[int]

class AppData(BaseModel):
    title: str
    reviews: int
    icon: str
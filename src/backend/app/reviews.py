from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class Reviews(BaseModel):
    reviews: List[str]


class ReviewsData(BaseModel):
    stars: Optional[int]
    oldest_review_date: datetime | str
    reviews: List[str] = None
    thumbs_up_count: List[int] = None
    small_nb_of_reviews: Optional[int] = None


class AppData(BaseModel):
    app_id: str
    title: str
    reviews: int
    icon: str
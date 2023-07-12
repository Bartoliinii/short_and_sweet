import google_play_scraper as gps
from dataclasses import dataclass
from typing import List
from datetime import datetime

from reviews import Reviews


class ReviewsScraper:
    def scrape_app_reviews(self, link: str, sort: str = 'newest',
                           stars: int = 3) -> Reviews:
        if sort == 'newest':
            sort = gps.Sort.NEWEST
        else:
            sort = gps.Sort.MOST_RELEVANT

        self.app_reviews, _ = gps.reviews(link,
                                       sort=sort,
                                       filter_score_with=stars,
                                       count=1)

        return Reviews(stars=stars,
                       oldest_review_date=self.get_oldest_review_date(),
                       reviews=self.get_reviews())

    def get_reviews(self) -> List[str]:
        return [rev['content'] for rev in self.app_reviews]

    def get_review_dates(self) -> List[datetime]:
        return [rev['at'] for rev in self.app_reviews]


    def get_oldest_review_date(self) -> datetime:
        return min(self.get_review_dates())


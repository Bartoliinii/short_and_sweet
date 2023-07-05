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

        self._app_reviews, _ = gps.reviews(link,
                                       sort=sort,
                                       filter_score_with=stars,
                                       count=200)
        return Reviews(stars=stars,
                       oldest_review_date=self._get_oldest_review_date(),
                       reviews=self._get_reviews(),
                       thumbs_up_count=self._get_thumbs_up_count())
# TODO create a for loop to scrape more than 200 reviews
    def _get_reviews(self) -> List[str]:
        return [rev['content'] for rev in self._app_reviews]

    def _get_review_dates(self) -> List[datetime]:
        return [rev['at'] for rev in self._app_reviews]
    
    def _get_thumbs_up_count(self) -> List[int]:
        return [rev['thumbsUpCount'] for rev in self._app_reviews]
    
    def _get_oldest_review_date(self) -> datetime:
        return min(self._get_review_dates())


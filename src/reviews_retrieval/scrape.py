from google_play_scraper import reviews, Sort
from typing import List
from datetime import datetime

from src.reviews_retrieval.reviews import Reviews


def scrape_app_reviews(link: str, order: str, stars: int,
                       count: int) -> Reviews:

    def get_reviews(reviews) -> List[str]:
        return [rev['content'] for rev in reviews]

    def get_review_dates(reviews) -> List[datetime]:
        return [rev['at'] for rev in reviews]

    def get_thumbs_up_count(reviews) -> List[int]:
        return [rev['thumbsUpCount'] for rev in reviews]

    def get_oldest_review_date(reviews) -> datetime:
        return min(get_review_dates(reviews), default='EMPTY')

    results = []
    sort = Sort.NEWEST if order == 'newest' else Sort.MOST_RELEVANT
    if count > 200:
        cnt, c_tkn = 200, None
        for _ in range(count // 200):
            result, c_tkn= reviews(link, lang='en', country='us', sort=sort,
                                   count=cnt, filter_score_with=stars,
                                   continuation_token=c_tkn)
            results.extend(result)
    else:
        results, _ = reviews(link, lang='en', country='us', sort=sort,
                             count=count, filter_score_with=5)
    return Reviews(stars=stars,
                   oldest_review_date= get_oldest_review_date(results),
                   reviews=get_reviews(results),
                   thumbs_up_count=get_thumbs_up_count(results))

# TODO Error handling
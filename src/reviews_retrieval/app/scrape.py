from google_play_scraper import reviews, app, Sort
from typing import List
from datetime import datetime
import re

from reviews import Reviews, AppData


def preprocess_reviews(r: str) -> str:
    r = re.sub(r'[^a-zA-Z0-9\s\.,;!?\"\']+', ' ', r)
    r = re.sub(r'(\.{2,})', ',', r)
    r = re.sub(r'(\W)\1+', r'\1', r)
    r = re.sub(r'\\"', "'", r)
    r = re.sub(r"\\'", "'", r)
    return r

def get_reviews(reviews) -> List[str]:
    return [preprocess_reviews(rev['content']) for rev in reviews]

def get_review_dates(reviews) -> List[datetime]:
    return [rev['at'] for rev in reviews]

def get_thumbs_up_count(reviews) -> List[int]:
    return [rev['thumbsUpCount'] for rev in reviews]

def get_oldest_review_date(reviews) -> datetime:
    return min(get_review_dates(reviews), default='EMPTY')

def scrape_app_reviews(link: str, stars: int, count: int = None ) -> Reviews:
    results, _ = reviews(link, lang='en', country='us', count=count,
                         filter_score_with=stars)
    return Reviews(stars=stars,
                   oldest_review_date=get_oldest_review_date(results),
                   reviews=get_reviews(results),
                   thumbs_up_count=get_thumbs_up_count(results))

def scrape_app_data(app_id: str) -> str:
    try:
        app_data = app(app_id)
        return AppData(title=app_data['title'],
                       reviews=app_data['reviews'],
                       icon=app_data['icon'])
    except:
        return None
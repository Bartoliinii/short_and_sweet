from google_play_scraper import reviews, app
from typing import List, Dict, Any
from datetime import datetime
import re
import time

from app.reviews import Reviews, AppData, ReviewsData
from app import config

print('im here')
url_pattern = re.compile(config['scraping']['url_pattern'])
id_pattern = re.compile(config['scraping']['id_pattern'])

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

def scrape_app_reviews(link: str, stars: int, count: int = None ) -> ReviewsData:
    results, _ = reviews(link, lang='en', country='us', count=count,
                         filter_score_with=stars)

    return ReviewsData(stars=stars,
                       oldest_review_date=get_oldest_review_date(results),
                       reviews=get_reviews(results),
                       thumbs_up_count=get_thumbs_up_count(results),
                       small_nb_of_reviews=len(results) if len(results) < count else None)

def scrape_app_data(app_id: str) -> AppData | None:
    try:
        app_data = app(app_id)
        return AppData(app_id=app_id,
                       title=app_data['title'],
                       reviews=app_data['reviews'],
                       icon=app_data['icon'])
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def validate_url(url: str) -> bool:
    return bool(url_pattern.match(url))

def extract_app_id(url: str) -> str | None:
    match = id_pattern.search(url)
    return match.group(1) if match else None

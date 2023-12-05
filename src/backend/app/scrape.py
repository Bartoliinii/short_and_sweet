from google_play_scraper import reviews, app
from typing import List
import re

from schemas import AppData, ReviewsData
from setup import BACKEND


url_pattern = re.compile(BACKEND['url_pattern'])
id_pattern = re.compile(BACKEND['id_pattern'])

def preprocess_reviews(r: str) -> str:
    r = re.sub(r'[^a-zA-Z0-9\s\.,;!?\"\']+', ' ', r)
    r = re.sub(r'(\.{2,})', ',', r)
    r = re.sub(r'(\W)\1+', r'\1', r)
    r = re.sub(r'\\"', "'", r)
    r = re.sub(r"\\'", "'", r)
    return r

def get_reviews(reviews) -> List[str]:
    return [preprocess_reviews(rev['content']) for rev in reviews]

def get_thumbs_up_count(reviews) -> List[int]:
    return [rev['thumbsUpCount'] for rev in reviews]

def scrape_app_reviews(app_id: str, stars: int,
                       count: int = None ) -> ReviewsData:
    results, _ = reviews(app_id, count=count, filter_score_with=stars)

    return ReviewsData(reviews=get_reviews(results),
                       thumbs_up_count=get_thumbs_up_count(results),
                       small_nb_of_reviews=len(results) if len(results) < count else None,
                       length=len(results))

def scrape_app_data(app_id: str) -> AppData | None:
    try:
        app_data = app(app_id)
        return AppData(title=app_data['title'],
                       icon=app_data['icon'],
                       reviews=app_data['reviews'])
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def validate_url(url: str) -> bool:
    return bool(url_pattern.match(url))

def extract_app_id(url: str) -> str | None:
    match = id_pattern.search(url)
    return match.group(1) if match else None

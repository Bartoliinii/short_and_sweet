from fastapi import APIRouter
import re

from src.reviews_retrieval.scrape import scrape_app_reviews
from src.reviews_retrieval.reviews import Reviews

scrape_router = APIRouter(prefix='/scrape')

@scrape_router.get('/get_reviews/')
async def get_reviews(url: str, order: str = 'newest',
                      stars: int = 1, count: int = 2000) -> Reviews:
    match = re.search(r'id=([^&]+)', url)
    if match:
        app_id = match.group(1)
        return scrape_app_reviews(app_id, order, stars, count)
    else:
        raise ValueError('Invalid URL')


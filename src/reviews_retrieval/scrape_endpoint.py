from fastapi import APIRouter

from scrape import scrape_app_reviews
from src.schemas import AppScrapeRequest

router = APIRouter('/scraper')

@router.post('/get_reviews')
async def get_reviews(request: AppScrapeRequest):
    return scrape_app_reviews(request.AppId,
                              request.Order,
                              request.Stars,
                              request.Count)
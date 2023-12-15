from fastapi import APIRouter, HTTPException
from httpx import AsyncClient
from typing import List, Dict

from setup import ERRORS, BACKEND, ENDPOINTS
from cache_management import redis_client as rc
from schemas import AppData, DistilBertResponse, BertopicInferenceResponse
from scrape import validate_url, extract_app_id, scrape_app_data, scrape_app_reviews


router = APIRouter()

async def fetch_inference_result(url: str, payload: dict) -> dict:
    async with AsyncClient() as client:
        response = await client.post(url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail=ERRORS['inferenceError'])
    return response.json()

def get_topic_reviews(key: int, representative_idx: int,
                      reviews: List[str], thumbs_up_count: List[int],
                      sentiment_classification: List[int],
                      review_classification: List[int]) -> List[Dict]:
    topic_classification = (i for i, x in enumerate(review_classification)
                            if int(x) == key)
    return [
        {
            'review': reviews[i],
            'thumbs_up_count': thumbs_up_count[i],
            'sentiment': sentiment_classification[i]
        }
        for i in topic_classification if i != representative_idx
    ]

@router.get('/app_data/')
async def app_data(url: str, stars: int = None,
                   count: int = BACKEND['min_reviews']) -> AppData:
    rc.clear_all()
    if not validate_url(url):
        raise HTTPException(status_code=404, detail=ERRORS['invalidUrl'])

    app_id = extract_app_id(url)
    app_data = scrape_app_data(app_id)
    if app_data is None or app_data.reviews < BACKEND['min_reviews']:
        raise HTTPException(status_code=404, detail=ERRORS['invalidUrl'])

    app_reviews = scrape_app_reviews(app_id, stars, count)
    if app_reviews.length < BACKEND['min_reviews']:
        raise HTTPException(status_code=404,
                            detail=ERRORS['insufficientReviews'])

    rc.cache('reviews', app_reviews.reviews)
    rc.cache('thumbs_up_count', app_reviews.thumbs_up_count)
    return app_data

@router.get('/request_inference/bertopic/')
async def request_inference_bertopic():
    reviews = rc.get_cache('reviews')
    response = await fetch_inference_result(ENDPOINTS['bertopic'],
                                            {"reviews": reviews})

    rc.cache('review_classification', response['classification'])
    rc.cache('topics', response['topics'])
    rc.cache('representative_reviews', response['representative_reviews'])

    topic_counts = {i: response['classification'].count(i)
                    for i in range(len(response['topics'])) if i > -1}
    return BertopicInferenceResponse(topics={
        i: v for i, v in enumerate(response['topics'])},
                                     counts=topic_counts)

@router.get('/request_inference/distilbert/')
async def request_inference_distilbert() -> DistilBertResponse:
    reviews = rc.get_cache('reviews')
    response = await fetch_inference_result(ENDPOINTS['distilbert'],
                                            {"reviews": reviews})

    rc.cache('sentiment_classification', response['classification'])

    classification_counts = {
        sentiment: response['classification'].count(sentiment)
        for sentiment in [-1, 0, 1]
    }
    return DistilBertResponse(positive=classification_counts[1],
                              negative=classification_counts[-1],
                              neutral=classification_counts[0])

@router.get('/more_data/')
async def more_data(topic: int):
    if not rc.ready():
        raise HTTPException(status_code=404, detail=ERRORS['resultsNotReady'])

    topics = rc.get_cache('topics')
    if topic >= len(topics):
        raise HTTPException(status_code=404, detail=ERRORS['invalidKey'])

    reviews = rc.get_cache('reviews')
    review_classification = rc.get_cache('review_classification')
    thumbs_up_count = rc.get_cache('thumbs_up_count')
    sentiment_classification = rc.get_cache('sentiment_classification')
    representative_reviews = rc.get_cache('representative_reviews')

    representative_idx = int(representative_reviews[topic])
    all_topic_reviews = get_topic_reviews(topic, representative_idx,
                                          reviews, thumbs_up_count,
                                          sentiment_classification,
                                          review_classification)
    return all_topic_reviews

@router.get('/healthcheck/')
async def healthcheck() -> str:
    return 'OK'

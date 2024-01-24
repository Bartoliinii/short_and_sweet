from fastapi import APIRouter, HTTPException

from setup import ERRORS, BACKEND, ENDPOINTS
from cache_management import redis_client as rc
from schemas import AppData, DistillbertResponse, BertopicResponse, \
                    DetailedResponse

from utils import check_count, validate_app_data, validate_app_reviews, \
                    request_inference, get_topic_reviews

router = APIRouter()

@router.get('/app_data/')
async def app_data(url: str, stars: int = None,
                   count: int = BACKEND['min_reviews']) -> AppData:
    rc.clear_all()
    check_count(count)
    app_id, app_data = validate_app_data(url)
    app_reviews = validate_app_reviews(app_id, stars, count)

    rc.cache('reviews', app_reviews.reviews)
    rc.cache('thumbs_up_count', app_reviews.thumbs_up_count)
    return app_data

@router.get('/request_inference/bertopic/')
async def request_inference_bertopic() -> BertopicResponse:
    response = await request_inference('bertopic')

    rc.cache('review_classification', response['classification'])
    rc.cache('topics', response['topics'])
    rc.cache('representative_reviews', response['representative_reviews'])

    topic_counts = {i: response['classification'].count(i)
                    for i in range(len(response['topics'])) if i > -1}
    return BertopicResponse(topics={
        i: v for i, v in enumerate(response['topics'])},
                                     counts=topic_counts)

@router.get('/request_inference/distilbert/')
async def request_inference_distilbert() -> DistillbertResponse:
    response = await request_inference('distilbert')

    rc.cache('sentiment_classification', response['classification'])

    classification_counts = {
        sentiment: response['classification'].count(sentiment)
            for sentiment in [ENDPOINTS['positive'],
                              ENDPOINTS['neutral'],
                              ENDPOINTS['negative']]
    }
    return DistillbertResponse(
        positive=classification_counts[ENDPOINTS['positive']],
        neutral=classification_counts[ENDPOINTS['neutral']],
        negative=classification_counts[ENDPOINTS['negative']])

@router.get('/more_data/')
async def more_data(cluster: int) -> DetailedResponse:
    if not rc.ready():
        raise HTTPException(status_code=404, detail=ERRORS['resultsNotReady'])
    reviews, thumbs_up_count, representative_reviews, review_classification, \
        sentiment_classification, topics = rc.get_more_data()

    if cluster < 0 or cluster >= len(representative_reviews):
        raise HTTPException(status_code=404, detail=ERRORS['invalidKey'])

    representative_idx = int(representative_reviews[cluster])
    all_topic_reviews = get_topic_reviews(cluster,
                                          representative_idx,
                                          reviews,
                                          thumbs_up_count,
                                          sentiment_classification,
                                          review_classification)
    response = DetailedResponse(cluster=topics[cluster],
                                reviews=all_topic_reviews)
    return response

@router.get('/healthcheck/')
async def healthcheck() -> str:
    return 'OK'
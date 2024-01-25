from fastapi import APIRouter, HTTPException

from schemas import InferenceRequest, TopicResponse
from load_dependencies import model


router = APIRouter()

@router.post('/inference', response_model=TopicResponse)
async def inference(request: InferenceRequest):
    try:
        document_classification = model.fit_transform(request.reviews)[0]
        topics = []
        representative_reviews = []
        for _, topic, _, name, _, rep_docs in model.get_topic_info().itertuples():
            if topic == -1:
                continue
            topics.append(" ".join(list(set(name.split('_')[1:]))))
            representative_reviews.append(request.reviews.index(rep_docs[0]))
        response = TopicResponse(
            topics=topics,
            classification=document_classification,
            representative_reviews=representative_reviews)
        return response
    except Exception as e:
        return TopicResponse(
            topics=["No topics found"],
            classification=[0] * len(request.reviews),
            representative_reviews=[request.reviews[0]]
        )
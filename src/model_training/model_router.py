from fastapi import APIRouter
from bertopic import BERTopic
import pandas as pd

from src.schemas import ModelInferenceRequest


model = BERTopic()

model_router = APIRouter(prefix='/model')

@model_router.post('/fit-transform')
async def fit_predict(request: ModelInferenceRequest) -> None:
    model.fit_transform(request.Reviews)

@model_router.post('/get_topics')
async def get_topics() -> pd.DataFrame:
    return model.get_topics()


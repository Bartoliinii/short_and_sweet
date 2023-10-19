from fastapi import APIRouter

from src.schemas import ModelInferenceRequest


model = 'FUCK'

router = APIRouter()

@router.post('/fit-predict')
async def fit_predict(request: ModelInferenceRequest):
    return model
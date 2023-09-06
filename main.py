from fastapi import FastAPI
from uvicorn import run

from src.model_training.model_router import model_router
from src.reviews_retrieval.scrape_endpoint import scrape_router


app = FastAPI()
app.include_router(model_router)
app.include_router(scrape_router)

run(app, host='0.0.0.0', port=7002)
from fastapi import FastAPI
from uvicorn import run
from src.model_training.model_router import router


app = FastAPI()
app.include_router(router)

run(app, host='0.0.0.0', port=7001)
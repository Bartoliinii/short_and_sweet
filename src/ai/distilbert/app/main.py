from fastapi import FastAPI

from load_dependencies import config
from endpoint import router


app = FastAPI()
app.include_router(router)
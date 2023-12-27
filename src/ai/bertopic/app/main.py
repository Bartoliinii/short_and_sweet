from fastapi import FastAPI

from endpoint import router


app = FastAPI()
app.include_router(router)


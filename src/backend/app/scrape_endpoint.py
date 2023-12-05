from fastapi import FastAPI, HTTPException

from scrape import scrape_app_reviews, scrape_app_data
from reviews import Reviews, AppData

app = FastAPI()

@app.get('/app_data/')
async def app_data(app_id: str) -> AppData:
    app_data = scrape_app_data(app_id)
    if app_data is None:
        raise HTTPException(status_code=404, detail='App not found')
    if app_data.reviews < 2000:
        raise HTTPException(status_code=404, detail='Not enough reviews')
    else:
         return app_data


@app.get('/get_reviews/')
async def get_reviews(app_id: str, stars: int = None,
                      count: int = 2000) -> Reviews:
        results = scrape_app_reviews(app_id, stars, count)
        return results
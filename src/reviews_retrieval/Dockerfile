FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY ./app .

CMD ["uvicorn", "scrape_endpoint:app", "--host", "0.0.0.0", "--port", "7001"]
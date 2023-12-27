FROM python:3.11-slim-bullseye

ENV PYTHONUNBUFFERED True

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && \
    apt-get -y install gcc && \
    pip install --upgrade pip && \
    pip install -r requirements.txt --default-timeout=100

COPY ./app .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
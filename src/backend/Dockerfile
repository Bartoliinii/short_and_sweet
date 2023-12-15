FROM python:3.11-slim-buster

WORKDIR /app

COPY ./requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

VOLUME /app

CMD ["python", "main.py"]
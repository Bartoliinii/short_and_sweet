import json
import redis
import logging


with open('app/configs/endpoints.json', 'r') as f:
    ENDPOINTS = json.load(f)

with open('app/configs/errors.json', 'r') as f:
    ERRORS = json.load(f)

with open('app/configs/redis.json', 'r') as f:
    REDIS = json.load(f)

with open('app/configs/backend.json', 'r') as f:
    BACKEND = json.load(f)

redisCli = redis.Redis(
    host=REDIS['setup']['host'],
    port=REDIS['setup']['port'],
    charset="utf-8",
    decode_responses=True)
connection = redisCli.ping()

logging.basicConfig(filename='backend.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(name)s %(message)s')
logging.info(f'Redis connection: {str(connection)}')
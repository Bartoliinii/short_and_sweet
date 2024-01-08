import json


with open('configs/endpoints.json', 'r') as f:
    ENDPOINTS = json.load(f)

with open('configs/errors.json', 'r') as f:
    ERRORS = json.load(f)

with open('configs/redis.json', 'r') as f:
    REDIS = json.load(f)

with open('configs/backend.json', 'r') as f:
    BACKEND = json.load(f)
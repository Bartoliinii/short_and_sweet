from redis import Redis

from setup import redisCli, REDIS


class RedisClient:
    def __init__(self, redis_cli: Redis) -> None:
        self.redis = redis_cli

    def clear_all(self):
        self.redis.flushdb()

    def cache(self, key: str, value: list | dict | str) -> None:
        self.redis.delete(key)
        if isinstance(value, list):
            self.redis.rpush(key, *value)
        elif isinstance(value, dict):
            for k, v in value.items():
                self.redis.hset(key, k, v)
        else:
            self.redis.set(key, value)

    def get_cache(self, key: str) -> list | dict | str:
        data_type = self.redis.type(key)
        if data_type == 'list':
            return self.redis.lrange(key, 0, -1)
        elif data_type == 'hash':
            return self.redis.hgetall(key)
        elif data_type == 'string':
            return self.redis.get(key)
        else:
            return None

    def ready(self) -> bool:
        return self.redis.exists(*REDIS['dependencies'])

redis_client = RedisClient(redisCli)
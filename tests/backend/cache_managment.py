from fastapi import HTTPException
import pytest
import redis
from cache_management import RedisClient
from setup import REDIS


@pytest.fixture
def redis_client():
    redis_db = redis.Redis(host="localhost",port=6379, charset="utf-8", decode_responses=True)
    return RedisClient(redis_db)

def test_caching(redis_client):
    v1 = ['value1', 'value2']
    v2 = {'field1': 'value1', 'field2': 'value2'}
    v3 = 'value3'
    redis_client.cache('key1', v1)
    redis_client.cache('key2', v2)
    redis_client.cache('key3', v3)

    assert redis_client.get_cache('key1') == v1
    assert redis_client.get_cache('key2') == v2
    assert redis_client.get_cache('key3') == v3

def test_clear_all(redis_client):
    redis_client.clear_all()
    assert redis_client.redis.dbsize() == 0

def test_delete_key(redis_client): # helped with none values
    redis_client.cache('key', 'value')
    assert redis_client.get_cache('key') == 'value'
    redis_client.cache('key', None)
    with pytest.raises(KeyError):
        redis_client.get_cache('key')

def test_ready_function(redis_client):
    for dependency in REDIS['dependencies']:
        redis_client.cache(dependency, 'value')
    assert redis_client.ready() is True
    redis_client.clear_all()
    assert redis_client.ready() is False

def test_ping_function(redis_client):
    assert redis_client.ping() is True

def test_get_more_data_success(redis_client):
    for dependency in REDIS['dependencies']:
        redis_client.cache(dependency, 'value')
    assert all(data == 'value' for data in redis_client.get_more_data())

def test_get_more_data_failure(redis_client):
    redis_client.clear_all()
    with pytest.raises(HTTPException):
        list(redis_client.get_more_data())

def test_nonexistent_key(redis_client):
    with pytest.raises(KeyError):
        redis_client.get_cache('nonexistent_key')

def test_cache_list(redis_client):
    test_list = ['item1', 'item2', 'item3']
    redis_client.cache('list_key', test_list)
    assert redis_client.get_cache('list_key') == test_list

def test_cache_dict(redis_client):
    test_dict = {'field1': 'value1', 'field2': 'value2'}
    redis_client.cache('dict_key', test_dict)
    assert redis_client.get_cache('dict_key') == test_dict

def test_cache_string(redis_client):
    test_string = 'test_string'
    redis_client.cache('string_key', test_string)
    assert redis_client.get_cache('string_key') == test_string

def test_get_cache_with_invalid_key(redis_client):
    with pytest.raises(KeyError):
        redis_client.get_cache('invalid_key')

def test_cache_overwrite(redis_client):
    initial_value = 'initial'
    updated_value = 'updated'
    redis_client.cache('key', initial_value)
    assert redis_client.get_cache('key') == initial_value
    redis_client.cache('key', updated_value)
    assert redis_client.get_cache('key') == updated_value

def test_ready_with_partial_dependencies(redis_client):
    partial_dependencies = REDIS['dependencies'][:-1]
    for dependency in partial_dependencies:
        redis_client.cache(dependency, 'value')
    assert redis_client.ready() is False

def test_ping_failure(redis_client, monkeypatch):
    def mock_ping():
        raise redis.exceptions.ConnectionError
    monkeypatch.setattr(redis_client.redis, 'ping', mock_ping)
    with pytest.raises(redis.exceptions.ConnectionError):
        redis_client.ping()

def test_get_more_data_with_empty_cache(redis_client): # helped with none values in cache
    for dependency in REDIS['dependencies']:
        redis_client.cache(dependency, [])
    assert all(data == [] for data in redis_client.get_more_data())

def test_clear_all_with_data(redis_client):
    redis_client.cache('key1', 'value1')
    redis_client.cache('key2', 'value2')
    redis_client.clear_all()
    assert redis_client.redis.dbsize() == 0

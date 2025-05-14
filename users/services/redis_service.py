from redis import Redis
from dotenv import load_dotenv
import os
load_dotenv()
class RedisService:
    def __init__(self, host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=os.getenv("REDIS_DB")):
        self.redis = Redis(host=host, port=port, db=db,decode_responses=True)

    def set_value(self, key, value):
        self.redis.set(key, value)

    def get_value(self, key):
        return self.redis.get(key)
    def create_key_json(self, key):
        self.redis.set(key, 0)
    def delete_key(self, key):
        self.redis.delete(key)
    def exists(self, key):
        return self.redis.exists(key)
    def hash_set_value(self, hash_name, key, value):
        self.redis.hset(hash_name, key, value)
    def hash_get_value(self, hash_name, key):
        return self.redis.hget(hash_name, key)
    def set_new_json_key(self, key):
        return self.redis.json().set(key, '$', {})
    def json_set_value(self, key, path, obj):
        
        if self.redis.exists(key):
            key_type = self.redis.type(key)
            if key_type != 'ReJSON-RL': 
                self.redis.delete(key)
        return {
            self.redis.json().set(key, path, obj),
            self.redis.expire(key, 900) 
                }
    
    def json_get_value(self, key):
        return self.redis.json().get(key)

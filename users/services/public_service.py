from users.models import Object
from users.models.object import ObjectStatus
from users.serializers.object import ObjectSerializer
from .redis_service import RedisService

class PublicService:
    def get_all_file(self, request):

        redis_sv = RedisService()
        check_exists = redis_sv.exists('objects')
        if check_exists:
            print('Data found in redis, fetching from redis')
            data = redis_sv.json_get_value('objects')
            if data:
                return data
        
        else:
            print('Data not found in redis, fetching from database')
            object_list = Object.objects.filter(status=ObjectStatus.ACCEPTED, is_deleted=False).order_by('created_at')
            serializer = ObjectSerializer(object_list, many=True)

            if object_list.exists():
                redis_sv.json_set_value('objects:all', "$",serializer.data)
                return serializer.data
            else:
                return []


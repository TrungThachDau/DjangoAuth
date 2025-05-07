from users.models import Object
from users.models.object import ObjectStatus
from users.serializers.object import ObjectSerializer


class PublicService:
    def get_all_file(self, request):
        object_list = Object.objects.filter(status=ObjectStatus.ACCEPTED, is_deleted=False).order_by('created_at')
        serializer = ObjectSerializer(object_list, many=True)

        if object_list.exists():
            return serializer.data
        else:
            return []


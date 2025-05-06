from adrf.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from users.models.object_status import ObjectStatus

class ObjectStatusSerializer(ModelSerializer):
    class Meta:
        model = ObjectStatus
        fields = ('id', 'status')

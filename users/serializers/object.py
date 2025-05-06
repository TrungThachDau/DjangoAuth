from adrf.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from users.models.object import Object
from users.serializers.object_status import ObjectStatusSerializer

class ObjectSerializer(ModelSerializer):
    status = ObjectStatusSerializer(read_only=True)
    class Meta:
        model = Object
        fields = ('id', 'name', 'url', 'status', 'created_at', 'account', 'extension')
        read_only_fields = ('id',)
        extra_kwargs = {
            'name': {
                'required': True,
                'validators': [UniqueValidator(queryset=Object.objects.all())]
            },
            'url': {'required': True},
            'status': {'required': True},
            'created_at': {'required': False},
            'account': {'required': False},
            'extension': {'required': False},
        }
        
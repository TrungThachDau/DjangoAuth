from adrf.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from users.models.object import Object

class ObjectSerializer(ModelSerializer):
    class Meta:
        model = Object
        
        fields = '__all__'
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
        def __str__(self):
            return self.name
        
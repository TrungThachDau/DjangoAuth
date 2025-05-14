
from adrf.serializers import ModelSerializer
from users.models.account import Account

class SignUpSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ('id','name', 'username', 'hashed_password', 'email')
        read_only_fields = ('id',)
        extra_kwargs = {
            'hashed_password': {'write_only': True},
            'email': {'required': True},
            'name': {'required': True},
        }
        

from adrf.serializers import ModelSerializer
from users.models.account import Account

class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ('id','name', 'username', 'hashed_password', 'email')
        read_only_fields = ('id',)

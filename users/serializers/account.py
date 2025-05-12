
from adrf.serializers import ModelSerializer
from users.models.account import Account

class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ('id','name', 'username', 'hashed_password', 'email')
        def __str__(self):
            return self.id


from adrf.serializers import ModelSerializer
from users.models.customer import Customer
from users.serializers.account import AccountSerializer

class CustomerSerializer(ModelSerializer):
    account = AccountSerializer(read_only=True)
    class Meta:
        model = Customer
        fields = ('__all__')
        read_only_fields = ('id',)

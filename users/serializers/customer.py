
from adrf.serializers import ModelSerializer
from users.models.customer import Customer

class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'address','phone','date','employee')
        read_only_fields = ('id',)

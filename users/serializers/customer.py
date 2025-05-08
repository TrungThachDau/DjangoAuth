
from adrf.serializers import ModelSerializer
from users.models.customer import Customer

class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = ('__all__')
        read_only_fields = ('id',)

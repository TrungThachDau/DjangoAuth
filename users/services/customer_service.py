from users.models import Customer
from users.serializers.customer import CustomerSerializer


class CustomerService:
    def get_customer_list(self,request):
        user = request.user
        customer_list = Customer.objects.filter(employee=user.id)
        serializer = CustomerSerializer(customer_list, many=True)
        if customer_list:
            return serializer.data
        else:
            raise ValueError(serializer.errors)

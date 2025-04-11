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
    def create_new_customer(self,request,**kwargs):
        user = request.user
        customer_data = request.data
        customer_data['employee'] = user.id
        serializer = CustomerSerializer(data=customer_data)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            raise ValueError(serializer.errors)
    def update_customer(self,request,customer_id):
        customer = Customer.objects.filter(id=customer_id).first()
        user = request.user
        if user.id!= customer.employee:
            raise ValueError("You are not authorized to update this customer")
        if customer:
            customer.employee = user.id
            serializer = CustomerSerializer(customer, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            else:
                raise ValueError(serializer.errors)
        else:
            raise ValueError("Customer not found")
    def delete_customer(self,request,customer_id):
        customer = Customer.objects.filter(id=customer_id).first()
        user = request.user
        if user.id!= customer.employee:
            raise ValueError("You are not authorized to delete this customer")
        if customer:
            customer.delete()
            return {"message": "Customer deleted successfully"}
        else:
            raise ValueError("Customer not found")
    def get_customer_detail(self,request,customer_id):
        customer = Customer.objects.filter(id=customer_id).first()
        user = request.user
        if user.id!= customer.employee:
            raise ValueError("You are not authorized to view this customer")
        if customer:
            serializer = CustomerSerializer(customer)
            return serializer.data
        else:
            raise ValueError("Customer not found")

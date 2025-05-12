from users.models import Customer
from users.models.employee import Employee
from users.serializers.account import AccountSerializer
from users.serializers.customer import CustomerSerializer
from django.db import transaction
from django.contrib.auth.hashers import make_password

class CustomerService:
    def get_customer_list(self,request):
        user = request.user
        emp = Employee.objects.filter(account_id=user.id).first()
        customer_list = Customer.objects.filter(employee=emp.id)
        serializer = CustomerSerializer(customer_list, many=True)
        if customer_list:
            return serializer.data
        else:
            return []
    def create_new_customer(self, request):
        user = request.user
        new_account = {
            'username': request.data.get('username'),
            'email': request.data.get('email'),
            'hashed_password': make_password('123456'),
            'name': request.data.get('name'),
            'is_authenticated': True,
        }
        emp_id = Employee.objects.filter(account_id=user.id).first()
        # Dữ liệu cho Customer
        customer_data = {
            'address': request.data.get('address'),
            'phone': request.data.get('phone'),
            'date': request.data.get('date'),
            'account': None,
            'employee': emp_id.id,
        }
        with transaction.atomic():
            # Tạo Account
            account_serializer = AccountSerializer(data=new_account)
            if account_serializer.is_valid():
                account = account_serializer.save()
                customer_data['account'] = account.id
                customer_serializer = CustomerSerializer(data=customer_data)
                if customer_serializer.is_valid():
                    customer = customer_serializer.save()
                    return customer_serializer.data
                else:
                    raise ValueError(customer_serializer.errors)
            else:
                # Nếu Account gặp lỗi, transaction sẽ rollback
                raise ValueError(account_serializer.errors)
    
    def update_customer(self,request,customer_id):
        customer = Customer.objects.filter(id=customer_id).first()
        user = request.user
        if customer:
            customer.employee = user
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
        if customer:
            customer.delete()
            return {"message": "Customer deleted successfully"}
        else:
            raise ValueError("Customer not found")
    
    def get_customer_detail(self,request,customer_id):
        customer = Customer.objects.filter(id=customer_id).first()
        # user = request.user
        # if user.id!= customer.employee:
        #     raise ValueError("You are not authorized to view this customer")
        if customer:
            serializer = CustomerSerializer(customer)
            return serializer.data
        else:
            raise ValueError("Customer not found")


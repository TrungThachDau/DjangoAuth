from users.models import EmployeeRole
from users.serializers.employy_role import EmployeeRoleSerializer


class EmployeeRoleService:
    def get_role_list(self,request):

        customer_list = EmployeeRole.objects.all()
        serializer = EmployeeRoleSerializer(customer_list, many=True)
        if customer_list:
            return serializer.data
        else:
            raise ValueError(serializer.errors)
    def create_new_role(self,request,**kwargs):

        customer_data = request.data
        serializer = EmployeeRoleSerializer(data=customer_data)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            raise ValueError(serializer.errors)
    def update_role(self,request,role_id):
        employee_role = Customer.objects.filter(id=role_id).first()
        if employee_role:
            serializer = EmployeeRoleSerializer(employee_role, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            else:
                raise ValueError(serializer.errors)
        else:
            raise ValueError("Customer not found")
    def delete_customer(self,request,role_id):
        employee_role = Customer.objects.filter(id=role_id).first()
        if employee_role:
            employee_role.delete()
            return {"message": "Customer deleted successfully"}
        else:
            raise ValueError("Customer not found")
    def get_customer_detail(self,request,role_id):
        employee_role = Customer.objects.filter(id=role_id).first()
        if employee_role:
            serializer = EmployeeRoleSerializer(employee_role)
            return serializer.data
        else:
            raise ValueError("Customer not found")

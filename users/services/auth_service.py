from users.models import Employee
from users.serializers.employee import EmployeeSerializer


class AuthService:
    def sign_up(self, request):
        data ={
            'name': request.data.get('name'),
            'username': request.data.get('username'),
            'email': request.data.get('email'),
            'hashed_password': request.data.get('hashed_password'),
            'role': request.data.get('role'),
        }
        serializer = EmployeeSerializer(data=data)
        if serializer.is_valid():
                serializer.save()
                return serializer.data
        else:
            raise ValueError(serializer.errors)

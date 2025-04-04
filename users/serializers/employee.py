
from adrf.serializers import ModelSerializer
from users.models.employee import Employee

class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id','name', 'username', 'hashed_password', 'email', 'role')
        read_only_fields = ('id',)


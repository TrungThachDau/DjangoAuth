
from adrf.serializers import ModelSerializer
from users.models.employee import Employee

class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ('__all__')
        read_only_fields = ('id',)

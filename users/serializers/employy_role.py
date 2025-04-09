
from adrf.serializers import ModelSerializer

from users.models import EmployeeRole
class EmployeeRoleSerializer(ModelSerializer):
    class Meta:
        model = EmployeeRole
        fields = ('id','name')
        read_only_fields = ('id',)

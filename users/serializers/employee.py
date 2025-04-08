
from adrf.serializers import Serializer
from django.core.validators import MinLengthValidator
from pyexpat.errors import messages
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from users.models.employee import Employee

class EmployeeSerializer(Serializer):
    name = serializers.CharField(max_length=10, required=True)
    class Meta:
        model = Employee
        fields = ('id','name', 'username', 'email', 'role', 'is_anonymous', 'is_authenticated', 'is_active')
        read_only_fields = ('id',)

    def create(self, validated_data):
        employee = Employee(**validated_data)
        employee.save()
        return employee


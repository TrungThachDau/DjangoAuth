
from adrf.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password
from users.models.employee import Employee

class SignUpSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id','name', 'username', 'hashed_password', 'email', 'role')
        read_only_fields = ('id',)
        extra_kwargs = {
            'hashed_password': {'write_only': True},
            'email': {'required': True},
            'username': {'min_length': 10, },
            'name': {'required': True},
        }
    def create(self, validated_data):
        validated_data['hashed_password'] = make_password(validated_data['hashed_password'])
        user = Employee(**validated_data)
        user.save()
        return user
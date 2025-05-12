from adrf.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from users.models.account import Account
from users.models.object import Object
from users.serializers.account import AccountSerializer

class ObjectSerializer(ModelSerializer):
    account = AccountSerializer(read_only=True)
    account_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        source='account',
        write_only=True
    )

    class Meta:
        model = Object
        fields = '__all__'
        extra_kwargs = {
            'name': {
                'required': True,
                'validators': [UniqueValidator(queryset=Object.objects.all())]
            },
        }

    def __str__(self):
        return self.name
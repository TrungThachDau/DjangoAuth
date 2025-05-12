from adrf.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from users.models.file_permission import FilePermission


class FilePermissionSerializer(ModelSerializer):
    class Meta:
        model = FilePermission
        fields = '__all__'
        read_only_fields = ('id',)


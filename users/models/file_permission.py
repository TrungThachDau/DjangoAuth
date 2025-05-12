from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from users.models.permission import Permission
from users.models.object import Object
class FilePermission(models.Model):
    id = models.AutoField(primary_key=True)
    object = models.ForeignKey(Object, on_delete=models.CASCADE, related_name='file_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='file_permissions')

    def __str__(self):
        return self.title

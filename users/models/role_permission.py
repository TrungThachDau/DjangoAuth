from django.db import models

from users.models.employee_role import EmployeeRole
from users.models.permission import Permission


class RolePermission(models.Model):
    id = models.AutoField(primary_key=True)
    role = models.ForeignKey(EmployeeRole, on_delete=models.CASCADE,blank=True, null=True)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE,blank=True, null=True)
    def __str__(self):
        return self.id

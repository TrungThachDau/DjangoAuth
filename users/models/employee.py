from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models

from . import Account
from .employee_role import EmployeeRole

class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    role = models.ForeignKey(EmployeeRole, on_delete=models.CASCADE,blank=True, null=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,blank=True, null=True)


    def __str__(self):
        return self.id

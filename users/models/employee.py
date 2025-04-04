from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .employee_role import EmployeeRole


class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(regex=r'[a-zA-Z0-9_.]+',message="Title must be alphanumeric")
        ])
    username = models.CharField(max_length=100,validators=[
        MinLengthValidator(10),
    ])
    hashed_password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    role = models.ForeignKey(EmployeeRole, on_delete=models.CASCADE,blank=True, null=True)

    def __str__(self):
        return self.name

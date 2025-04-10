from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .employee_role import EmployeeRole

class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='')
    username = models.CharField(max_length=100, unique=True)
    hashed_password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    role = models.ForeignKey(EmployeeRole, on_delete=models.CASCADE,blank=True, null=True)
    is_anonymous = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_changed_password = models.BooleanField(default=False)
    is_admin_user = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD =  'username'

    def save(self, *args, **kwargs):
        if not self.id:
            self.is_anonymous = True
            self.is_authenticated = False
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

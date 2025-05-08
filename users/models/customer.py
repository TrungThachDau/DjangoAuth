from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .employee import Employee
from .account import Account


class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=255,null=True, blank=True)
    phone = models.CharField(max_length=10,null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE,blank=True, null=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,blank=True, null=True)



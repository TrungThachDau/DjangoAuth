from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .object_status import ObjectStatus
from .account import Account


class ObjectUrlsCustomer(models.Model):
    id = models.AutoField(primary_key=True)
    url = models.CharField(max_length=255,null=True, blank=True)
    status = models.ForeignKey(ObjectStatus, on_delete=models.CASCADE,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,blank=True, null=True)


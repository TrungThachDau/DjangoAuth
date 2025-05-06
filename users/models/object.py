from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .object_status import ObjectStatus
from .account import Account


class Object(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255,null=True, blank=True)
    url = models.TextField(null=True, blank=True)
    status = models.ForeignKey(ObjectStatus, on_delete=models.CASCADE,blank=True, null=True,related_name='object')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,blank=True, null=True)
    extension = models.CharField(max_length=10,null=True, blank=True)
    
    def __str__(self):
        return self.name


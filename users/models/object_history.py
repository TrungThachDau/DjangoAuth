from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .object_status import ObjectStatus
from .account import Account
from .object import Object

class ObjectHistory(models.Model):
    id = models.AutoField(primary_key=True)
    object = models.ForeignKey(Object, on_delete=models.CASCADE, related_name='object_history')
    changed_by = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True)
    field_name = models.CharField(max_length=255)
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-changed_at']



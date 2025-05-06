
from django.db import models


class ObjectStatus(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=255, null=True, blank=True)


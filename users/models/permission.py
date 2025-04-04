from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models

class Permission(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

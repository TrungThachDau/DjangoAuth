from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from .customer import Customer


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(
        max_length=255,
        validators=[
            RegexValidator(regex=r'[a-zA-Z0-9_.]+',message="Title must be alphanumeric")
        ])
    description = models.CharField(max_length=255,default="")
    description2 = models.CharField(max_length=255,default="")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,blank=True, null=True)


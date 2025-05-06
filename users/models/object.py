from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models


class ObjectStatus(models.TextChoices):
    ACCEPTED = 'accepted', 'Accepted'
    REJECTED = 'rejected', 'Rejected'
    PENDING = 'pending', 'Pending'

class Object(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    url = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=10,
        choices=ObjectStatus.choices,
        default=ObjectStatus.PENDING,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey('users.Account', on_delete=models.CASCADE, blank=True, null=True)
    extension = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.name


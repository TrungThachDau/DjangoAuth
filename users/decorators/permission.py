from functools import wraps
from django.http import HttpResponseForbidden
from rest_framework.permissions import BasePermission
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from asgiref.sync import sync_to_async
from rest_framework.authentication import BasicAuthentication


from rest_framework_simplejwt.authentication import JWTAuthentication

from users.models.account import Account

def custom_permission_classes(permissions):
    def decorator(func):
        @wraps(func)
        async def wrapper(request, *args, **kwargs):
            # if not request.user.is_authenticated:
            #     return HttpResponseForbidden("You must be logged in to access this resource.")
            for permission in permissions:
                if permission == "IsStaff":
                    try:
                        account = await sync_to_async(Account.objects.get)(id=request.user.id)
                        if not account.is_staff:
                            return HttpResponseForbidden("You do not have permission to access this resource.")
                    except Account.DoesNotExist:
                        return HttpResponseForbidden("Account does not exist.")
            return func(request, *args, **kwargs)
        return wrapper
    return decorator






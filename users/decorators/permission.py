from functools import wraps
from django.http import HttpResponseForbidden
from asgiref.sync import sync_to_async
from rest_framework import status
from users.models.account import Account

def custom_permission_classes(permissions):
    def decorator(func):
        @wraps(func)
        async def wrapper(request, *args, **kwargs):
            for permission in permissions:
                if permission == "IsStaff":
                    try:
                        print(request.user)
                        account = await sync_to_async(Account.objects.get)(id=request.user.id)
                        if not account.is_staff:
                            return HttpResponseForbidden(
                                "You do not have permission to access this resource.",
                                status=status.HTTP_403_FORBIDDEN
                            )
                    except Account.DoesNotExist:
                        return HttpResponseForbidden("Account does not exist.")
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator



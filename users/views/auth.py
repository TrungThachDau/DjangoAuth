from asgiref.sync import sync_to_async
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from adrf.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Employee
import hashlib

from users.serializers.employee import EmployeeSerializer
from users.services.auth_service import AuthService


@api_view(['POST'])
@authentication_classes([BasicAuthentication])  # Disable default authentication
@permission_classes([AllowAny])
async def sign_in(request, *args, **kwargs):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"status": "error", "message": "Username and password are required"}, status=400)

    query = await sync_to_async(Employee.objects.filter(username=username, hashed_password=password).first)()
    if query:
        token = get_token_for_user(query)
        return Response({"status": "success", "message": "Login successful","data":token}, status=200)
    else:
        return Response({"status": "error", "message": "Invalid credentials"}, status=400)
def get_token_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_up(request):
    try:
        sv = AuthService()
        rq = sv.sign_up(request)
        if rq:
            return Response({"status": "success", "message": "User created successfully", "data": rq}, status=201)
        else:
            return Response({"status": "error", "data":rq}, status=400)
    except Exception as e:
        return Response({"status": "error", "message": e}, status=400)
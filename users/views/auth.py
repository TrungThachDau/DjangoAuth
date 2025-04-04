from asgiref.sync import sync_to_async
from rest_framework.response import Response
from adrf.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import Employee
import hashlib

from users.serializers.employee import EmployeeSerializer


@api_view(['POST'])
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
async def sign_up(request, *args, **kwargs):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({"status": "error", "message": "Username, password and email are required"}, status=400)
    if await sync_to_async(Employee.objects.filter(username=username).exists)():
        return Response({"status": "error", "message": "Username already exists"}, status=400)
    try:
        hashing = hashlib.sha256(password.encode())
        hashing = hashing.hexdigest()
        employee = await sync_to_async(Employee.objects.create)(username=username, hashed_password=hashing, email=email)
        return Response({"status": "success", "message": "User created successfully"}, status=201)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
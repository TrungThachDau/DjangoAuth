from asgiref.sync import sync_to_async
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from adrf.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.services.auth_service import AuthService


@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_in(request):
    try:
        auth_service = AuthService()
        token = await sync_to_async(auth_service.sign_in)(request.data)
        user = await sync_to_async(auth_service.get_user)(request.data)
        return Response({"status": "success", "message": "Login successful", "data": token, "user":user}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_up(request):
    try:
        auth_service = AuthService()
        new_user = await sync_to_async(auth_service.sign_up)(request.data)
        return Response({"status": "success", "message": "User created successfully","data":new_user}, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def reset_password(request):
    try:
        auth_service = AuthService()
        token = await sync_to_async(auth_service.reset_password)(request.data)
        return Response({"status": "success", "message": "Email sent successfully", "data":token},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def confirm_new_password(request,token):
    try:
        auth_service = AuthService()
        await sync_to_async(auth_service.confirm_new_password)(request.data,token)
        return Response({"status": "success", "message": "User update successfully"}, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
async def change_password(request):
    try:
        auth_service = AuthService()
        await sync_to_async(auth_service.change_password)(request.data)
        return Response({"status": "success", "message": "User updated successfully"}, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_out(request):
    try:
        auth_service = AuthService()
        await sync_to_async(auth_service.sign_out)(request.data)
        return Response({"status":"success"},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

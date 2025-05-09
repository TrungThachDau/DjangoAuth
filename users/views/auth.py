from asgiref.sync import sync_to_async
from django.http import HttpResponse
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from adrf.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..decorators.permission import custom_permission_classes
from users.services.auth_service import AuthService
from users.services.mino_service import MinioService

@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_in(request):
    try:
        auth_service = AuthService()
        token = await sync_to_async(auth_service.sign_in)(request.data)
        user = await sync_to_async(auth_service.get_user)(request.data)
        print(token.get('accessToken'))
        print(user)
        response = Response({"message": "Login successful", "data": token, "user": user}, status=status.HTTP_200_OK)
        response.set_cookie(key='is_staff', value=user.get('is_staff'), httponly=True, secure=False, path='/')
        response.set_cookie(key='accessToken', value=token.get('accessToken'), httponly=True, secure=False, path='/')
        response.set_cookie(key='refreshToken', value=token.get('refreshToken'), httponly=True, secure=False, path='/')
        #response.set_cookie(key='user', value=user.id, httponly=True, secure=True, samesite='None', path='/')
        return response
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_up(request):
    try:
        auth_service = AuthService()
        token = await sync_to_async(auth_service.sign_up)(request.data)
        user = await sync_to_async(auth_service.get_user)(request.data)
        return Response({"message": "User created successfully","data":token,"user":user}, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def reset_password(request):
    try:
        auth_service = AuthService()
        token = await sync_to_async(auth_service.reset_password)(request.data)
        return Response({"message": "Email sent successfully", "data":token},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def confirm_new_password(request,token):
    try:
        auth_service = AuthService()
        await sync_to_async(auth_service.confirm_new_password)(request.data,token)
        return Response({"message": "User update successfully"}, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def change_password(request):
    try:
        auth_service = AuthService()
        await sync_to_async(auth_service.change_password)(request.data)
        return Response({"message": "User updated successfully"}, status=status.HTTP_201_CREATED)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def sign_out(request):
    try:
        auth_service = AuthService()
        await sync_to_async(auth_service.sign_out)(request.data)
        return Response({"status":"success"},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
async def get_user(request):
    try:
        auth_service = AuthService()
        res =  await sync_to_async(auth_service.get_user)(request)
        return Response({"data":res},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
async def get_user2(request,token):
    try:
        auth_service = AuthService()
        res =  await sync_to_async(auth_service.get_user2)(request,token)
        return Response({"data":res},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
def upload_file(request):
    try:
        minio_service = AuthService()
        res = minio_service.upload_file(request)
        return Response({"data":res},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@custom_permission_classes(["IsStaff"])
def upload_multi_file(request):
    try:
        auth_sv = AuthService()
        res = auth_sv.upload_multi_file(request)
        return Response({"message":"Upload successful"},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
def get_all_objects(request):
    try:
        auth_sv = AuthService()
        res = auth_sv.get_object_list()
        return Response({"data":res},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])    
def update_file(request):
    try:
        auth_sv = AuthService()
        res = auth_sv.update_file(request)
        return Response({"message":"Update successful"},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([BasicAuthentication])
@permission_classes([AllowAny])
def delete_file(request):
    try:
        auth_sv = AuthService()
        res = auth_sv.delete_file(request)
        return Response({"message":"Delete successful"},status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
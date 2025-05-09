from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from adrf.decorators import api_view
from asgiref.sync import sync_to_async
from users.decorators.permission import custom_permission_classes
from users.services.object_service import ObjectService
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
# @custom_permission_classes(["IsStaff"])
async def get_object_of_customer(request):
    try:
        obj_sv = ObjectService()
        res = await sync_to_async(obj_sv.get_all_objects_of_customer)(request)
        return Response({"data": res}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@custom_permission_classes(["IsStaff"])
async def authorize_object(request):
    try:
        obj_sv = ObjectService()
        res = await sync_to_async(obj_sv.authorize_object)(request)
        return Response({"data": res}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
async def get_object(request, object_id):
    try:
        obj_sv = ObjectService()
        res = await sync_to_async(obj_sv.get_object)(request, object_id)
        return Response({"data": res}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

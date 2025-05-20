from adrf.decorators import api_view
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from users.services.public_service import PublicService


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([AllowAny])
def get_all_objects(request):
    try:
        auth_sv = PublicService()
        res = auth_sv.get_all_file(request)
        return Response({"data": res}, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
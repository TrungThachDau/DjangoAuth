from adrf.views import APIView
from asgiref.sync import sync_to_async
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.services.employee_role_service import EmployeeRoleService

class EmployeeRoleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    async def get(self, request):
        try:
            role_sv = EmployeeRoleService()
            response = await  sync_to_async(role_sv.get_role_list)(request)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def post(self, request):
        try:
            role_sv = EmployeeRoleService()
            response = await sync_to_async(role_sv.create_new_role)(request)
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def put(self, request, pk):
        try:
            role_sv = EmployeeRoleService()
            response = await sync_to_async(role_sv.update_role)(request, pk)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def delete(self, request, pk):
        try:
            role_sv = EmployeeRoleService()
            response = await sync_to_async(role_sv.delete_role)(request, pk)
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
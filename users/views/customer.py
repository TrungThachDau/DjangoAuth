from adrf.views import APIView
from asgiref.sync import sync_to_async
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.services.customer_service import CustomerService
class CustomerView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    async def get(self, request):
        try:
            customer_sv = CustomerService()
            response = await sync_to_async(customer_sv.get_customer_list)(request)
            
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    async def post(self, request):
        try:
            customer_sv = CustomerService()
            response = await sync_to_async(customer_sv.create_new_customer)(request)
            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomerDetailView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    async def get(self, request, pk):
        try:
            customer_sv = CustomerService()
            response = await sync_to_async(customer_sv.get_customer_detail)(request, pk)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    async def put(self, request, pk):
        try:
            customer_sv = CustomerService()
            response = await sync_to_async(customer_sv.update_customer)(request, pk)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def delete(self, request, pk):
        try:
            customer_sv = CustomerService()
            response = await sync_to_async(customer_sv.delete_customer)(request, pk)
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




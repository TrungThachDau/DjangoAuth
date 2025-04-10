from adrf.views import APIView
from asgiref.sync import sync_to_async
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import Customer
from users.serializers.customer import CustomerSerializer
from users.services.customer_service import CustomerService
class CustomerView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsAdminUser]
    # async def get(self, request):
    #     try:
    #         user = request.user
    #         customers = await sync_to_async(Customer.objects.filter)(employee=user.id)
    #         serializer = CustomerSerializer(customers, many=True)
    #         return Response(serializer.data)
    #     except Exception as e:
    #         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    async def get(self, request):
        try:
            customer_sv = CustomerService()
            rp =await  sync_to_async(customer_sv.get_customer_list)(request)
            return Response(rp, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



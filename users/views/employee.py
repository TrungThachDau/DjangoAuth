from asgiref.sync import sync_to_async
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from adrf.views import APIView
from adrf.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.models.account import Account
from rest_framework import status
from users.serializers.employee import EmployeeSerializer

class EmployeeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsAdminUser]
    async def retrieve(self, request, pk,*args, **kwargs):
        try:
            book = await sync_to_async(Account.objects.filter(id=pk).first, thread_sensitive=True)()
            serializer = EmployeeSerializer(book)
            return Response(serializer.data)
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    async def list(self, request, *args, **kwargs):
        try:
            books = await sync_to_async(Account.objects.all)()
            serializer = EmployeeSerializer(books, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    async def create(self, request, **kwargs):
        try:
            book_list = request.data
            created_books = []
            errors = []
            for book_data in book_list:
                serializer = EmployeeSerializer(data=book_data)
                if serializer.is_valid():
                    book = await sync_to_async(serializer.save, thread_sensitive=True)()
                    created_books.append(serializer.data)
                else:
                    errors.append(serializer.errors)
            if errors:
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
            return Response(created_books, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def update(self, request, id):
        try:
            book =await sync_to_async(Account.objects.filter(id=id).first(),thread_sensitive=True)()
            serializer = EmployeeSerializer(book=book, data=request.data)
            if serializer.is_valid():
                await sync_to_async(serializer.save,thread_sensitive=True)()
                return Response(serializer.data)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    async def destroy(self, request, pk, **kwargs):
        try:
            book = await sync_to_async(Account.objects.filter(id=pk).first, thread_sensitive=True)()
            if book is not None:
                await sync_to_async(book.delete, thread_sensitive=True)()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




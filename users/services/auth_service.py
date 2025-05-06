from datetime import datetime

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.serializers import serialize
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.exceptions import TokenError
from users.models import Account, Object
from users.models.employee import Employee
from users.models.employee_role import EmployeeRole
from users.serializers.auth import SignUpSerializer
from rest_framework_simplejwt.tokens import api_settings
from django.core.mail import send_mail
from django.db import transaction

from users.serializers.object_history import ObjectHistorySerializer
from .mino_service import MinioService
from users.serializers.employee import EmployeeSerializer
from ..serializers.object import ObjectSerializer


class AuthService:
    def get_token_for_user(self,user):
        refresh = RefreshToken.for_user(user)
        return {
            'refreshToken': str(refresh),
            'accessToken': str(refresh.access_token),
        }
    def get_user_from_token(self, Token):
        token_backend = TokenBackend(algorithm='HS256',signing_key=settings.SECRET_KEY)
        user_decode = token_backend.decode(Token, verify=True)
        user_id = user_decode.get('user_id')
        if user_id:
            user = Account.objects.filter(id=user_id).first()
            if user:
                return {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_changed_password': user.is_changed_password,
                }
            else:
                raise ValueError("Token invalid")
    def get_user2(self, request_data,Token):
        
        token_backend = TokenBackend(algorithm='HS256',signing_key=settings.SECRET_KEY)
        user_decode = token_backend.decode(Token, verify=True)
        user_id = user_decode.get('user_id')
        if user_id:
            user = Account.objects.filter(id=user_id).first()
            if user:
                return {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_changed_password': user.is_changed_password,
                    'role': user.role.id,
                }
            else:
                raise ValueError("Token invalid")
    def get_user(self, request_data):
        username = request_data.get('username')
        if not username:
            raise ValueError("Username is required")
        user = Account.objects.filter(username=username).first()
        if user:
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_changed_password': user.is_changed_password,
            }
        else:
            raise ValueError("User not found")
    def sign_up(self, request_data, **kwargs):
        # Băm mật khẩu đúng cách
        request_data['hashed_password'] = make_password(request_data.get('password'))
        serializer = SignUpSerializer(data=request_data)
        request_data['is_staff'] = True

        with transaction.atomic():
            if serializer.is_valid():
                account = serializer.save()

                # Lấy đối tượng EmployeeRole
                try:
                    role = EmployeeRole.objects.get(id=2)
                except EmployeeRole.DoesNotExist:
                    raise ValueError("Role with id=2 does not exist")

                # Tạo Employee liên kết với Account
                employee_data = Employee(
                    account=account,
                    role=role,
                )
                employee_data.save()

                # Tạo token cho Account
                token = self.get_token_for_user(account)
                return token
            else:
                error_messages = []
                for field, errors in serializer.errors.items():
                    for error in errors:
                        error_messages.append(f"{field}: {error}")
                raise ValueError("; ".join(error_messages))

    def sign_in(self, request_data):
        username = request_data.get('username')
        password = request_data.get('password')
        if not username or not password:
            raise ValueError("Username and password are required")
        
        # Tìm người dùng theo username
        user = Account.objects.filter(username=username).first()
        if user:
            # Kiểm tra mật khẩu
            if not check_password(password, user.hashed_password):
                raise ValueError("Invalid password")
            
            # Tạo token nếu mật khẩu hợp lệ
            token = self.get_token_for_user(user)
            return token
        else:
            raise ValueError("Invalid credentials")

    def sign_out(self, request):
        token = request.get('refreshToken')
        if not token:
            raise ValueError("Token is required")
        refresh = RefreshToken(token)
        refresh.blacklist()
        return {"message": "Ok"}

    def change_password(self, request_data):
        user = self.get_user_from_token(request_data.get('accessToken'))
        username = user.get('username')
        old_password = request_data.get('old_password')
        new_password = request_data.get('new_password')
        if not username or not old_password or not new_password:
            raise ValueError("Username, old password and new password are required")
        user = Account.objects.filter(username=username).first()
        if user:
            if not check_password(old_password, user.hashed_password):
                raise ValueError("Invalid old password")
            user.hashed_password = make_password(new_password)
            user.is_changed_password = True
            user.save()

            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_changed_password': user.is_changed_password,
            }
        else:
            raise ValueError("Invalid credentials")

    def reset_password(self,request_data):
        username = request_data.get('username')
        email = request_data.get('email')
        user = Account.objects.filter(username=username, email=email).first()
        if user:
            token = self.get_token_for_user(user)
            send_mail(
                "Reset Password",
                "https://master.d1xxb9w4wrs7q.amplifyapp.com/confirm-password?token=" + str(token['refreshToken']),
                "quangtrung.nguyen.2016@gmail.com",
                [user.email],
                fail_silently=False,
            )
            return token
        else:
            raise ValueError("Invalid credentials")

    def confirm_new_password(self, request_data, token):
        user = self.get_user_from_token(token)
        username = user.get('username')
        new_password = request_data.get('new_password')
        if not username or not new_password:
            raise ValueError("Username and new password are required")
        try:
            UntypedToken(token)
        except TokenError as e:
            raise ValueError(f"Invalid token: {e}")
        user = Account.objects.filter(username=username).first()
        if user:
            user.hashed_password = make_password(new_password)
            user.is_changed_password = True
            user.save()
            try:
                refresh = RefreshToken(token)
                refresh.blacklist()
            except TokenError as e:
                raise ValueError(f"Invalid token: {e}")
            return {"message": "Password changed successfully"}
        else:
            raise ValueError("Invalid credentials")

    def upload_file(self,request):
        user = request.user
        bucket_name = request.data['bucket_name']
        file_path = request.data['file_path']
        object_name = request.data['object_name']
        extension_name = file_path.split('.')[-1].upper()
        try:
            minio_sv = MinioService()

            if not minio_sv.minio_client.bucket_exists(bucket_name):
                return False
            res = minio_sv.upload_file(bucket_name, file_path, object_name)
            url = "http://"+minio_sv.endpoint + "/" + bucket_name + "/" + object_name
            

            if res:
                new_file = {
                    'url': url,
                    'name': object_name,
                    'status':1,
                    'create_at': datetime.now(),
                    'update_at': datetime.now(),
                    'account':user.id,
                    'extension': extension_name
                }
                serializer_file = ObjectSerializer(data=new_file)
                if serializer_file.is_valid():
                    serializer_file.save()
                else:
                    raise ValueError(serializer_file.errors)
            return True
        except Exception as e:
            print(f"Error uploading file: {e}")
            raise ValueError(f"{e}")
    def upload_multi_file(self,request):
        user = request.user
        file_paths = request.data['file_paths']
        bucket_name = request.data['bucket_name']
        try:
            minio_sv = MinioService()
            res = minio_sv.upload_multi_file(bucket_name, file_paths)
            if res:     
                for file_path in file_paths:
                    object_name = file_path.split('\\')[-1]
                    new_file = {
                        'url': "http://"+minio_sv.endpoint + "/" + bucket_name + "/" + object_name,
                        'name': object_name,
                        'status':1,
                        'create_at': datetime.now(),
                        'update_at': datetime.now(),
                        'account':user.id,
                        'extension': file_path.split('.')[-1].upper()
                    }
                    serializer_file = ObjectSerializer(data=new_file)
                    if serializer_file.is_valid():
                        serializer_file.save()
                        return {
                            'status': 'success',
                            'message': "Upload file successfully",
                        }
                    else:
                        raise ValueError(serializer_file.errors)
        except Exception as e:
            print(f"Error uploading files: {e}")
            raise ValueError(f"{e}")
    def get_object_list(self):
        object_list = Object.objects.all()

        serializer = ObjectSerializer(object_list, many=True)
        if object_list.exists():
            return serializer.data
        else:
            raise ValueError(serializer.errors)

    def update_file(self, request):
        object_id = request.data['object_id']
        new_file_path = request.data['new_file_path']
        query = Object.objects.filter(id=object_id).first()
        bucket_name = "images"
        new_extension = new_file_path.split('.')[-1].upper()
        print(new_extension)
        if query:
            object_name = query.name
            extension_name = query.extension

            if( extension_name != new_extension):
                raise ValueError("Extension not match")
            else:

                minio_sv = MinioService()
                res = minio_sv.upload_file(bucket_name, new_file_path, object_name)
                if res:
                    file_update = {
                        'name': object_name,
                        'status':'pending',
                        'update_at': datetime.now(),
                        'extension': extension_name
                    }
                    serializer_file = ObjectSerializer(query, data=file_update, partial=True)
                    if serializer_file.is_valid():
                        serializer_file.save()
                        # Update history
                        object_history = {
                            'object': query.id,
                            'changed_by': request.user.id,
                            'field_name': 'file_path',
                            'changed_at': datetime.now(),

                        }
                        serializer_history = ObjectHistorySerializer(data=object_history)
                        if serializer_history.is_valid():
                            serializer_history.save()
                        else:
                            raise ValueError(serializer_history.errors)
                        return {
                            'status': 'success',
                            'message': "Update file successfully",
                        }
                    else:
                        raise ValueError(serializer_file.errors)





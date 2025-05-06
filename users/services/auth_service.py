from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.exceptions import TokenError
from users.models import Account
from users.models.employee import Employee
from users.models.employee_role import EmployeeRole
from users.serializers.auth import SignUpSerializer
from rest_framework_simplejwt.tokens import api_settings
from django.core.mail import send_mail
from django.db import transaction

from users.serializers.employee import EmployeeSerializer


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
                    'role': user.role.id,
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
        request_data['hashed_password'] = make_password(request_data.get('password'))
        serializer = SignUpSerializer(data=request_data)
        request_data['is_staff'] = True

        with transaction.atomic():
            if serializer.is_valid():
                account = serializer.save()    
                try:
                    role = EmployeeRole.objects.get(id=2)
                except EmployeeRole.DoesNotExist:
                    raise ValueError("Role with id=2 does not exist")     
                employee_data = Employee(
                    account=account,
                    role=role,
                )
                employee_data.save()            
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
        user = Account.objects.filter(username=username).first()
        if user:
            if not check_password(password, user.hashed_password):
                raise ValueError("Invalid password")
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
                'role': user.role.id,
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

    def create_new_customer(self, request):
        user = request.user

        # Dữ liệu cho Account
        new_account = {
            'username': request.data.get('username'),
            'email': request.data.get('email'),
            'password': "12345678",  # Mật khẩu mặc định (nên thay bằng mật khẩu ngẫu nhiên)
            'hashed_password': request.data.get('hashed_password'),  # Sửa lỗi chính tả
        }

        # Dữ liệu cho Customer
        customer_data = {
            'address': request.data.get('address'),
            'phone': request.data.get('phone'),
            'date': request.data.get('date'),
            'employee': user.id,  # Liên kết với nhân viên hiện tại
            'name': request.data.get('name'),
        }

        # Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
        with transaction.atomic():
            # Tạo Account
            account_serializer = AccountSerializer(data=new_account)
            if account_serializer.is_valid():
                account = account_serializer.save()
                customer_data['account'] = account.id  # Liên kết Account với Customer

                # Tạo Customer
                customer_serializer = CustomerSerializer(data=customer_data)
                if customer_serializer.is_valid():
                    customer = customer_serializer.save()
                    return customer_serializer.data
                else:
                    # Nếu Customer gặp lỗi, transaction sẽ rollback
                    raise ValueError(customer_serializer.errors)
            else:
                # Nếu Account gặp lỗi, transaction sẽ rollback
                raise ValueError(account_serializer.errors)



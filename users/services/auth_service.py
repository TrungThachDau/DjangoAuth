from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.exceptions import TokenError
from users.models import Employee
from users.serializers.auth import SignUpSerializer
from django.core.mail import send_mail

class AuthService:
    def get_token_for_user(self,user):
        refresh = RefreshToken.for_user(user)
        return {
            'refreshToken': str(refresh),
            'accessToken': str(refresh.access_token),
        }
    def sign_up(self, request_data):
        serializer = SignUpSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
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
        user = Employee.objects.filter(username=username).first()
        if user:
            if not check_password(password, user.hashed_password):
                raise ValueError("Invalid password")
            if not user.is_changed_password:
                raise ValueError("Password not changed. Please change new password")
            token = self.get_token_for_user(user)
            return token
        else:
            raise ValueError("Invalid credentials")
    def change_password(self, request_data):
        username = request_data.get('username')
        old_password = request_data.get('old_password')
        new_password = request_data.get('new_password')
        if not username or not old_password or not new_password:
            raise ValueError("Username, old password and new password are required")
        user = Employee.objects.filter(username=username).first()
        if user:
            if not check_password(old_password, user.hashed_password):
                raise ValueError("Invalid old password")
            user.hashed_password = make_password(new_password)
            user.is_changed_password = True
            user.save()

            return {"message": "Password changed successfully"}
        else:
            raise ValueError("Invalid credentials")

    def forget_password(self,request_data):
        username = request_data.get('username')
        user = Employee.objects.filter(username=username).first()
        if user:
            token = self.get_token_for_user(user)
            send_mail(
                "Reset Password",
                "https://localhost:8000/api/confirm-new-password/" + str(token['accessToken']),
                "quangtrung.nguyen.2016@gmail.com",
                [user.email],
                fail_silently=False,
            )
        else:
            raise ValueError("Invalid credentials")

    def confirm_new_password(self, request_data, token):
        username = request_data.get('username')
        new_password = request_data.get('new_password')

        if not username or not new_password:
            raise ValueError("Username and new password are required")

        try:
            UntypedToken(token)
        except TokenError as e:
            raise ValueError(f"Invalid token: {e}")

        user = Employee.objects.filter(username=username).first()
        if user:
            user.hashed_password = make_password(new_password)
            user.is_changed_password = True
            user.save()

            try:
                refresh = RefreshToken(token)
                refresh.blacklist()
            except TokenError:
                pass

            return {"message": "Password changed successfully"}
        else:
            raise ValueError("Invalid credentials")

    # def send_email(self,*args):
    #
    #     send_mail(
    #         "Subject here",
    #         "Here is the message.",
    #         "quangtrung.nguyen.2016@gmail.com",
    #         ["qtrung1702@outlook.com"],
    #         fail_silently=False,
    #     )



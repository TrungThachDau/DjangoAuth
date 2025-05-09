from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('accessToken')
        print("accessToken", access_token)
        if not access_token:
            return None  # Không có token thì không xác thực

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
        except Exception:
            raise AuthenticationFailed('Invalid token')

        if user is None:
            raise AuthenticationFailed('User not found')
        return (user, validated_token)


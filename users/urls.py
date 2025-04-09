
from django.urls import path,include

from . import views
from rest_framework import routers

from .views.auth import sign_in, sign_up, confirm_new_password, forgot_password
from .views.employee import EmployeeViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
router = routers.DefaultRouter()
router.register(r'employee', EmployeeViewSet, basename="async")
urlpatterns = [
    # path('books/', views.books, name='books'),
    path('users/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include(router.urls)),

    path('auth/signin/', sign_in, name='signin'),
    path('auth/signup/', sign_up, name='signup'),
    path('auth/forgot-password/', forgot_password, name='forgot_password'),
    path('confirm-new-password/<str:token>/',confirm_new_password, name="confirm_new_password"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
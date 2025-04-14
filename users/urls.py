
from django.urls import path,include
from .views.auth import *
from .views.customer import CustomerView, CustomerDetailView
from .views.employee import EmployeeView
from .views.employee_role import EmployeeRoleView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView, TokenBlacklistView,
)
urlpatterns = [
    path('users/', include('rest_framework.urls', namespace='rest_framework')),

    path('auth/signin/', sign_in, name='signin'),
    path('auth/signup/', sign_up, name='signup'),
    path('auth/reset-password/', reset_password, name='reset_password'),
    path('confirm-new-password/<str:token>/',confirm_new_password, name="confirm_new_password"),

    path('auth/change-password/', change_password, name='change_password'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('customer/', CustomerView.as_view()),
    path('employee/', EmployeeView.as_view()),
    path('customer/<int:pk>/', CustomerDetailView.as_view()),

    path('employee_role/', EmployeeRoleView.as_view()),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    ]

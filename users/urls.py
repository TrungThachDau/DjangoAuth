
from django.urls import path,include

from . import views
from rest_framework import routers

from .views.auth import *
from .views.customer import CustomerView
from .views.employee import EmployeeView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
urlpatterns = [
    # path('books/', views.books, name='books'),
    path('users/', include('rest_framework.urls', namespace='rest_framework')),

    path('auth/signin/', sign_in, name='signin'),
    path('auth/signup/', sign_up, name='signup'),
    path('auth/reset-password/', reset_password, name='reset_password'),
    path('confirm-new-password/<str:token>/',confirm_new_password, name="confirm_new_password"),

    path('auth/change-password/', change_password, name='change_password'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('customer/', views.customer.CustomerView.as_view()),
    path('employee/', views.employee.EmployeeView.as_view())
    ]

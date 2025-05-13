
from django.urls import path,include
from .views.auth import *
from .views.public import get_all_objects as get_all_objects_public
from .views.object import get_object_of_customer, authorize_object, get_object, delete_file, upload_multi_file, update_file, get_all_objects
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
    path('auth/user/', get_user, name='get_user'),
    path('auth/user2/<str:token>/', get_user2, name='get_user2'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('customer/', CustomerView.as_view()),
    path('employee/', EmployeeView.as_view()),
    path('customer/<int:pk>/', CustomerDetailView.as_view()),
    path('employee_role/', EmployeeRoleView.as_view()),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('auth/sign-out/',sign_out, name='sign_out'),
    # path('auth/get_url_object/',get_url_object, name='get_url_object'),
    # path('auth/upload_file/',upload_file, name='upload_file'),
    path('file/upload/',upload_multi_file, name='upload_multi_file'),
    path('file/get_all/',get_all_objects, name='get_all_objects'),
    path('file/update_file/',update_file, name='update_file'),
    path('file/delete/',delete_file, name='delete_file'),
    path('public/get_all_files/', get_all_objects_public, name='get_all_objects'),
    path('file/get/',get_object_of_customer ,name='get_object_of_customer'),
    path('file/<int:object_id>/', get_object , name='get_object'),
    path('file/authorize/', authorize_object, name='authorize_object'),
]
    
    

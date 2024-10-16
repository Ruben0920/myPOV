from django.urls import path
from .views import SignupView, LoginView, ForgotPasswordView
urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot_password'),
]

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser 
from django.contrib.auth import authenticate, login as django_login
from rest_framework_simplejwt.tokens import RefreshToken
from .controllers import send_email_otp
from django.utils import timezone 

class SignupView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email') 
        
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)


        user = CustomUser.objects.create_user(username=username, password=password, email=email,expires_at = timezone.now() + timezone.timedelta(hours=24))
        user.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
                'username': user.username,
                'email': user.email,
                'expires_at': user.expires_at.isoformat(),
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
    
    
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:

            if user.expires_at < timezone.now():
                return Response({"error": "Temporary account has expired. Please create a new one."}, status=status.HTTP_403_FORBIDDEN)

            django_login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'username': user.username,
                'expires_at': user.expires_at.isoformat(),
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView): 
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', None)
        
        if email is None: 
            return Response({"error": "No email or password provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            user = CustomUser.objects.filter(email=email).first()
            if not user:
                return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
            if user.expires_at < timezone.now():
                 return Response({"error": "Temporary account has expired."}, status=status.HTTP_403_FORBIDDEN)

            send_email_otp(email) #
            return Response({"success": "Email sent"}, status=status.HTTP_200_OK)
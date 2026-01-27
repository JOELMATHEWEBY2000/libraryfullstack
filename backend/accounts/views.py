from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, UserActivity
from .serializers import (
    RegisterSerializer,
    UserBasicSerializer,
    UserDetailSerializer,
)
from .permissions import IsAdminUser


# -------------------------
# REGISTER
# -------------------------
class RegisterCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        UserActivity.objects.create(
            user=user,
            action="User registered"
        )


# -------------------------
# LOGIN
# -------------------------
from rest_framework.authentication import BasicAuthentication
from cart.models import PurchaseCart, RentalCart


class LoginView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            request,
            email=email.lower(),
            password=password
        )

        print("AUTH RESULT:", user)  # DEBUG

        if not user:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.status == "blocked":
            return Response(
                {"error": "Account is blocked"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        PurchaseCart.objects.filter(user__isnull=True).update(user=None)
        RentalCart.objects.filter(user__isnull=True).update(user=None)
        
        refresh = RefreshToken.for_user(user)

        UserActivity.objects.create(
            user=user,
            action="User logged in"
        )

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserBasicSerializer(user).data,
        })
    


# -------------------------
# PROFILE (logged-in user)
# -------------------------
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserDetailSerializer

    def get_object(self):
        return self.request.user


# -------------------------
# USERS LIST (admin)
# -------------------------
class UsersListView(generics.ListAPIView):
    queryset = User.objects.filter(role="user")
    serializer_class = UserBasicSerializer
    permission_classes = [AllowAny]

class AdminListView(generics.ListAPIView):
    queryset = User.objects.filter(role="admin")
    serializer_class = UserBasicSerializer
    permission_classes = [AllowAny]

# -------------------------
# UPDATE USER STATUS
# -------------------------
class UpdateUserStatusView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["active", "blocked"]:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.status = new_status
        user.save()

        UserActivity.objects.create(
            user=user,
            action=f"Status changed to {new_status}"
        )

        return Response({"message": "Status updated successfully"})


# -------------------------
# DELETE USER
# -------------------------
class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def perform_destroy(self, instance):
        UserActivity.objects.create(
            user=instance,
            action="User deleted"
        )
        instance.delete()

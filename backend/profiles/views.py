from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Profile
from .serializers import ProfileSerializer


# ---------------------------
# VIEW PROFILE
# ---------------------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

# ---------------------------
# ADD PROFILE
# ---------------------------
class ProfileAddView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if Profile.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Profile already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)   # 🔥 USER LINKED

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ---------------------------
# UPDATE PROFILE
# ---------------------------
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)

        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

class ProfileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        profile.delete()
        return Response(
            {"detail": "Profile deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )

from rest_framework import serializers
from .models import User, UserActivity


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "phone",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone already exists")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            full_name=validated_data["full_name"],
            phone=validated_data["phone"],
            password=validated_data["password"],
            role="user",          # enforced
            status="active",      # enforced
        )
    
class AdminRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "full_name",
            "phone",
        )
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(
            **validated_data,
            role="superadmin"  # 👑 force superadmin
        )
        user.set_password(password)
        user.save()
        return user


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "status",
            "role",
        ]


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ["action", "timestamp"]

class UserDetailSerializer(serializers.ModelSerializer):
    activities = UserActivitySerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "phone",
            "role",
            "status",
            "activities",
        ]
        read_only_fields = ["role", "status"]

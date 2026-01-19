from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("superadmin", "Super Admin"),
        ("staff", "Staff"),
        ("user", "User"),
    )

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, unique=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="user",
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("active", "Active"),
            ("blocked", "Blocked"),
        ],
        default="active",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def is_superadmin(self):
        return self.role == "superadmin"

    def is_staff_user(self):
        return self.role in ["staff", "superadmin"]

    def __str__(self):
        return self.email


class UserActivity(models.Model):
    user = models.ForeignKey(User, related_name="activities", on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} – {self.action}"

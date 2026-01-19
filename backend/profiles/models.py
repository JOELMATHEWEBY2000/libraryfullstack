from django.conf import settings
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(              # 🔥 ADD THIS
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    fullname = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    profile_picture = models.ImageField(
        upload_to="profiles/",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.user.email

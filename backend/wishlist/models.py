from django.conf import settings
from django.db import models
from books.models import Book

class Wishlist(models.Model):
    user = models.ForeignKey(           # 🔥 ADD THIS
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist_items"
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    note = models.TextField(blank=True)
    priority = models.IntegerField(default=1)

    class Meta:
        unique_together = ("user", "book")  # 🔒 prevent duplicates

    def __str__(self):
        return f"{self.user} - {self.book}"

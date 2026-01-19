from django.db import models
from accounts.models import User
from books.models import Book
from datetime import date, timedelta
from django.utils.timezone import now


class PurchaseOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} → {self.book.title}"


class RentalOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rent_start = models.DateField(default=now)
    rent_end = models.DateField()

    @property
    def is_active(self):
        return date.today() <= self.rent_end

    def __str__(self):
        return f"{self.user} rented {self.book.title}"

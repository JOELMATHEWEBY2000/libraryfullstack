from django.db import models
from django.conf import settings
from books.models import Book
from datetime import timedelta


class PurchaseCart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1) 
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} x {self.quantity}"
    
    @property
    def title(self):
        return self.book.title

    @property
    def price(self):
        return self.book.price

    @property
    def subtotal(self):
        return self.book.price * self.quantity


class RentalCart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    duration = models.IntegerField(default=7)   # ✅ REQUIRED
    start_date = models.DateField(auto_now_add=True)
    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("RETURNED", "Returned"),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    def __str__(self):
        return f"{self.book.title} ({self.duration} days)"

    # ✅ Derived from Book
    @property
    def title(self):
        return self.book.title

    @property
    def price(self):
        return self.book.rental_price_per_day

    @property
    def expiry_date(self):
        return self.start_date + timedelta(days=self.duration)

    @property
    def subtotal(self):
        return self.book.rental_price_per_day * self.duration

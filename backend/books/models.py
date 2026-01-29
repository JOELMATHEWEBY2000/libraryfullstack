from django.db import models
from cloudinary.models import CloudinaryField

class Book(models.Model):
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=250)
    isbn = models.CharField(max_length=20, unique=True)
    category = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rental_price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    rented_quantity = models.IntegerField()
    cover_image = CloudinaryField(
        "image",
        folder="books",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title

    @property
    def available_stock(self):
        return self.stock_quantity - self.rented_quantity

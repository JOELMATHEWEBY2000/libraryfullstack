from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from django.db.models import F

from .models import Book
from cart.models import PurchaseCart,RentalCart

@receiver(post_save, sender=PurchaseCart)
def reduce_stock_after_purchase(sender, instance, created, **kwargs):
    if not created:
        return

    with transaction.atomic():
        Book.objects.filter(id=instance.book_id).update(
            stock_quantity=F("stock_quantity") - instance.quantity
        )

@receiver(post_save, sender=RentalCart)
def increase_rented_on_rent(sender, instance, created, **kwargs):
    if created and instance.status == "active":
        Book.objects.filter(id=instance.book_id).update(
            rented_quantity=F("rented_quantity") + 1
        )

@receiver(post_save, sender=RentalCart)
def decrease_rented_on_return(sender, instance, created, **kwargs):
    if not created and instance.status == "returned":
        Book.objects.filter(id=instance.book_id).update(
            rented_quantity=F("rented_quantity") - 1
        )

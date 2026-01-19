from rest_framework import serializers
from .models import PurchaseOrder, RentalOrder
from books.serializers import BookSerializer


class PurchaseOrderSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = PurchaseOrder
        fields = "__all__"


class RentalOrderSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = RentalOrder
        fields = "__all__"

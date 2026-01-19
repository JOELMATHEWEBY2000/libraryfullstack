from rest_framework import serializers
from .models import PurchaseCart, RentalCart
from books.serializers import BookMiniSerializer
from accounts.serializers import UserBasicSerializer


class PurchaseCartSerializer(serializers.ModelSerializer):
    book = BookMiniSerializer(read_only=True)
    user= UserBasicSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()
    class Meta:
        model = PurchaseCart
        fields = ["id","user","book", "added_at", "quantity","subtotal",]

    def get_subtotal(self, obj):
        return obj.book.price * obj.quantity


class RentalCartSerializer(serializers.ModelSerializer):
    book = BookMiniSerializer(read_only=True)
    user= UserBasicSerializer(read_only=True)
    expiry_date = serializers.ReadOnlyField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = RentalCart
        fields = [
            "id",
            "user",
            "book",
            "duration",
            "start_date",
            "expiry_date",
            "subtotal",
            "status",
        ]

    def get_subtotal(self, obj):
        return obj.book.rental_price_per_day * obj.duration

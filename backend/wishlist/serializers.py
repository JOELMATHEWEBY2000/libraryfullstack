from rest_framework import serializers
from .models import Wishlist
from books.serializers import BookMiniSerializer

class WishlistSerializer(serializers.ModelSerializer):
    book = BookMiniSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "book",
            "note",
            "priority",
        ]

    def get_book(self, obj):
        return {
            "id": obj.book.id,
            "title": obj.book.title,
            "author": obj.book.author,
            "price": obj.book.price,
            "cover_image": obj.book.cover_image.url if obj.book.cover_image else None,
        }

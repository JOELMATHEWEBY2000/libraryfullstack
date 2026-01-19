from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Wishlist
from .serializers import WishlistSerializer
from books.models import Book


# ---------------------------------
# GET ALL WISHLIST ITEMS (no user)
# ---------------------------------
class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        ).order_by("-id")

    def get_serializer_context(self):
        return {"request": self.request}


# ---------------------------------
# ADD WISHLIST ITEM (no user)
# ---------------------------------
class WishlistAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book")
        if not book_id:
            return Response({"error": "Book ID required"}, status=400)

        book = get_object_or_404(Book, id=book_id)

        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user,
            book=book
        )

        return Response(
            WishlistSerializer(
                wishlist,
                context={"request": request}
            ).data,
            status=201 if created else 200
        )


# ---------------------------------
# TOGGLE ADD/REMOVE (no user)
# ---------------------------------
class WishlistToggleView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        book_id = request.data.get("book_id")
        if not book_id:
            return Response({"error": "Book ID required"}, status=400)

        book = get_object_or_404(Book, id=book_id)

        existing = Wishlist.objects.filter(book=book)

        if existing.exists():
            existing.delete()
            return Response({"message": "Removed"})

        Wishlist.objects.create(book=book)
        return Response({"message": "Added"})


# ---------------------------------
# UPDATE NOTE / PRIORITY (no user)
# ---------------------------------
class WishlistUpdateView(APIView):
    permission_classes = [permissions.AllowAny]

    def put(self, request, id):
        item = get_object_or_404(Wishlist, id=id)

        if "note" in request.data:
            item.note = request.data["note"]
        if "priority" in request.data:
            item.priority = request.data["priority"]

        item.save()
        return Response(WishlistSerializer(item,context={"request": request}).data)


# ---------------------------------
# DELETE (no user)
# ---------------------------------
class WishlistDeleteView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, id):
        item = get_object_or_404(Wishlist, id=id)
        item.delete()
        return Response({"message": "Deleted"})

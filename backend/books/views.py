from rest_framework import viewsets, generics
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.db import models
from django.db.models import Q

from .models import Book
from .serializers import BookSerializer

from django.core.files.storage import default_storage
from rest_framework.decorators import action

# --------------------------------------------------------
# LIST + RETRIEVE – GET /api/books/view/
# --------------------------------------------------------
class BookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get"])
    def storage_check(self, request):
        return Response({
            "storage": str(default_storage.__class__)
        })

class BookListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        books = Book.objects.all()

        q = request.GET.get("q")
        genre = request.GET.get("genre")
        availability = request.GET.get("availability")
        rating = request.GET.get("rating")
        min_price = request.GET.get("minPrice")
        max_price = request.GET.get("maxPrice")

        if q:
            books = books.filter(
                Q(title__icontains=q) |
                Q(author__icontains=q) |
                Q(isbn__icontains=q)
            )

        if genre:
            books = books.filter(category=genre)

        if availability == "available":
            books = books.filter(stock_quantity__gt=models.F("rented_quantity"))

        if rating:
            books = books.filter(rating__gte=rating)

        if min_price:
            books = books.filter(price__gte=min_price)

        if max_price:
            books = books.filter(price__lte=max_price)

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

from rest_framework.permissions import IsAdminUser

class BookListCreateView(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

class BookUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]



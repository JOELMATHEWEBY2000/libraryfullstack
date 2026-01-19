from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from books.models import Book
from books.serializers import BookSerializer
from django.db.models import F

@api_view(["GET"])
@permission_classes([AllowAny])
def inventory_list(request):
    books = Book.objects.all().order_by("title")

    data = []

    for b in books:
        available = b.stock_quantity - b.rented_quantity
        data.append({
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "category": b.category.name if b.category else None,
            "stock_quantity": b.stock_quantity,
            "rented_quantity": b.rented_quantity,
            "available": available,
        })

    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def low_stock(request):
    books = Book.objects.filter(stock_quantity__lt=5)

    data = [{
        "id": b.id,
        "title": b.title,
        "stock_quantity": b.stock_quantity,
        "available": b.stock_quantity - b.rented_quantity,
    } for b in books]

    return Response(data)

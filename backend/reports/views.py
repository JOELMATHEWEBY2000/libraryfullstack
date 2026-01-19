from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField

from cart.models import PurchaseCart, RentalCart
from books.models import Book


@api_view(["GET"])
@permission_classes([AllowAny])
def sales_report(request):
    data = (
        PurchaseCart.objects
        .values(book_title=F("book__title"))  # ✅ renamed
        .annotate(total=Sum("quantity"))
        .order_by("-total")
    )

    return Response(list(data))



from django.db.models import F

from django.db.models import Sum, F
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])
def rentals_report(request):
    data = (
        RentalCart.objects
        .values(book_title=F("book__title"))  # ✅ renamed
        .annotate(total=Sum("duration"))
        .order_by("-total")
    )

    return Response(list(data))



@api_view(["GET"])
@permission_classes([AllowAny])
def revenue_report(request):
    purchase_revenue = (
        PurchaseCart.objects.aggregate(
            total=Sum(
                F("quantity") * F("book__price"),
                output_field=DecimalField()
            )
        )["total"] or 0
    )

    rental_revenue = (
        RentalCart.objects.aggregate(
            total=Sum(
                F("duration") * F("book__rental_price_per_day"),
                output_field=DecimalField()
            )
        )["total"] or 0
    )

    return Response({
        "purchase_revenue": purchase_revenue,
        "rental_revenue": rental_revenue,
        "total_revenue": purchase_revenue + rental_revenue
    })

from django.db.models import Count

@api_view(["GET"])
@permission_classes([AllowAny])
def book_popularity_report(request):
    data = (
        Book.objects
        .annotate(
            purchases=Count("purchasecart"),
            rentals=Count("rentalcart"),
        )
        .annotate(
            total_activity=Count("purchasecart") + Count("rentalcart")
        )
        .values(
            "id",
            "title",
            "purchases",
            "rentals",
            "total_activity"
        )
        .order_by("-total_activity")
    )

    return Response(data)

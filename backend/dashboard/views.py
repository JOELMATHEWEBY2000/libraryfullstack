from datetime import date, timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count, F, DecimalField, ExpressionWrapper

from accounts.models import User
from books.models import Book
from cart.models import PurchaseCart, RentalCart
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication


# =========================
# DASHBOARD INSIGHTS
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def dashboard_insights(request):

    total_users = User.objects.count()
    total_books = Book.objects.count()

    # Active rentals = all rental carts
    active_rentals = RentalCart.objects.count()

    # Purchase revenue = quantity * book.price
    revenue = (
        PurchaseCart.objects.aggregate(
            total=Sum(
                ExpressionWrapper(
                    F("quantity") * F("book__price"),
                    output_field=DecimalField()
                )
            )
        )["total"] or 0
    )

    low_stock = Book.objects.filter(stock_quantity__lt=5).count()

    # Pending returns (computed, no returned field)
    today = date.today()
    pending_returns = 0

    for r in RentalCart.objects.all():
        due_date = r.start_date + timedelta(days=r.duration)
        if due_date < today:
            pending_returns += 1

    return Response({
        "total_users": total_users,
        "total_books": total_books,
        "active_rentals": active_rentals,
        "revenue": revenue,
        "low_stock_count": low_stock,
        "pending_returns": pending_returns,
    })


# =========================
# REVENUE CHART
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def revenue_chart(request):

    purchase_revenue = (
        PurchaseCart.objects.aggregate(
            total=Sum(
                ExpressionWrapper(
                    F("quantity") * F("book__price"),
                    output_field=DecimalField()
                )
            )
        )["total"] or 0
    )

    rental_revenue = (
        RentalCart.objects.aggregate(
            total=Sum(
                ExpressionWrapper(
                    F("duration") * F("book__rental_price_per_day"),
                    output_field=DecimalField()
                )
            )
        )["total"] or 0
    )

    return Response({
        "purchase_revenue": purchase_revenue,
        "rental_revenue": rental_revenue,
        "total_revenue": purchase_revenue + rental_revenue,
    })


# =========================
# PURCHASE STATS
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def purchase_stats(request):

    stats = (
        PurchaseCart.objects
        .values("book__title")
        .annotate(count=Count("id"))
        .order_by("-count")[:10]
    )

    return Response(list(stats))


# =========================
# LOW STOCK LIST
# =========================
@api_view(["GET"])
def low_stock_list(request):

    books = Book.objects.filter(stock_quantity__lt=5).values(
        "id", "title", "stock_quantity"
    )

    return Response(list(books))


# =========================
# PENDING RETURNS LIST
# =========================
@api_view(["GET"])
@permission_classes([AllowAny])
def pending_returns_list(request):
    today = date.today()
    data = []

    rentals = RentalCart.objects.filter(
        status="ACTIVE"
    ).select_related("book")   # ✅ user removed

    for r in rentals:
        if r.expiry_date < today:
            data.append({
                "id": r.id,
                "book": r.book.title,
                "status": r.status,
                "start_date": r.start_date.isoformat(),
                "due_date": r.expiry_date.isoformat(),
                "days_overdue": (today - r.expiry_date).days,
            })

    return Response(data)



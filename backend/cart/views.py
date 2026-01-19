from rest_framework import generics,permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from rest_framework import status
from django.shortcuts import get_object_or_404

from books.models import Book
from accounts.models import User
from .models import PurchaseCart, RentalCart
from .serializers import PurchaseCartSerializer, RentalCartSerializer


# =========================
# PURCHASE CART
# =========================

class AddPurchaseCart(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book")
        qty = int(request.data.get("quantity", 1))

        if not book_id:
            return Response({"error": "book is required"}, status=400)

        book = get_object_or_404(Book, id=book_id)

        cart_item, created = PurchaseCart.objects.get_or_create(
            user=request.user,
            book=book,
            defaults={"quantity": qty}
        )

        if not created:
            cart_item.quantity += qty
            cart_item.save()

        return Response(
            PurchaseCartSerializer(cart_item).data,
            status=status.HTTP_201_CREATED
        )


class PurchaseCartList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = PurchaseCart.objects.filter(user=request.user)
        serializer = PurchaseCartSerializer(items, many=True, context={"request": request})
        return Response(serializer.data)


class RemovePurchaseCart(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        item = get_object_or_404(PurchaseCart, id=pk)
        item.delete()
        return Response({"message": "Removed"})
    
class AdminPurchaseCartListView(generics.ListAPIView):
    queryset = PurchaseCart.objects.select_related(
        "user", "book"
    ).order_by("-added_at")

    serializer_class = PurchaseCartSerializer
    permission_classes = [permissions.AllowAny]




# =========================
# RENTAL CART
# =========================

class AddRentalCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get("book")
        duration = int(request.data.get("duration", 7))

        if not book_id:
            return Response({"error": "book is required"}, status=400)

        book = get_object_or_404(Book, id=book_id)

        cart_item, created = RentalCart.objects.get_or_create(
            user=request.user,
            book=book,
            defaults={"duration": duration}
        )

        if not created:
            cart_item.duration = duration
            cart_item.save()

        return Response(
            RentalCartSerializer(cart_item).data,
            status=status.HTTP_201_CREATED
        )


class RentalCartList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = RentalCart.objects.filter(user=request.user)
        serializer = RentalCartSerializer(items, many=True, context={"request": request})
        return Response(serializer.data)


class RemoveRentalCart(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        item = get_object_or_404(RentalCart, id=pk)
        item.delete()
        return Response({"message": "Removed"})
    
class AdminRentalCartListView(generics.ListAPIView):
    queryset = RentalCart.objects.select_related(
        "user", "book"
    ).order_by("-start_date")

    serializer_class = RentalCartSerializer
    permission_classes = [permissions.AllowAny]



class CartSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ No authentication

    def get(self, request):
        # =========================
        # PURCHASE TOTAL
        # price × quantity
        # =========================
        purchase_total = (
            PurchaseCart.objects.filter(user=request.user)
            .annotate(
                subtotal=ExpressionWrapper(
                    F("book__price") * F("quantity"),
                    output_field=DecimalField(max_digits=10, decimal_places=2),
                )
            )
            .aggregate(total=Sum("subtotal"))["total"]
            or 0
        )

        # =========================
        # RENTAL TOTAL
        # rent_price × duration
        # =========================
        rental_total = (
            RentalCart.objects.filter(user=request.user)
            .annotate(
                subtotal=ExpressionWrapper(
                    F("book__rental_price_per_day") * F("duration"),
                    output_field=DecimalField(max_digits=10, decimal_places=2),
                )
            )
            .aggregate(total=Sum("subtotal"))["total"]
            or 0
        )

        return Response({
            "purchase_total": purchase_total,
            "rental_total": rental_total,
            "grand_total": purchase_total + rental_total
        })

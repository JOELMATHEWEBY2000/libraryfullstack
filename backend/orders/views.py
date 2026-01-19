from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import PurchaseOrder, RentalOrder
from .serializers import PurchaseOrderSerializer, RentalOrderSerializer


class UserLibraryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        purchased = PurchaseOrder.objects.filter(user=user)
        rentals = RentalOrder.objects.filter(user=user, rent_end__gte=date.today())
        history = RentalOrder.objects.filter(user=user)

        return Response({
            "purchased": PurchaseOrderSerializer(purchased, many=True).data,
            "rentals": RentalOrderSerializer(rentals, many=True).data,
            "history": RentalOrderSerializer(history, many=True).data
        })

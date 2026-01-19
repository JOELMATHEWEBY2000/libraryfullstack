from django.urls import path
from .views import (
    PurchaseCartList,
    AddPurchaseCart,
    RemovePurchaseCart,
    RentalCartList,
    AddRentalCart,
    RemoveRentalCart,
    CartSummaryAPIView,
    AdminPurchaseCartListView,
    AdminRentalCartListView,
)

urlpatterns = [
    # PURCHASE
    path("purchase/", PurchaseCartList.as_view()),
    path("purchase/add/", AddPurchaseCart.as_view()),
    path("admin/purchase/", AdminPurchaseCartListView.as_view()),
    path("purchase/remove/<int:pk>/", RemovePurchaseCart.as_view()),

    # RENTAL
    path("rental/", RentalCartList.as_view()),
    path("rental/add/", AddRentalCart.as_view()),
    path("admin/rental/", AdminRentalCartListView.as_view()),
    path("rental/remove/<int:pk>/", RemoveRentalCart.as_view()),

    path("summary/", CartSummaryAPIView.as_view()),

]

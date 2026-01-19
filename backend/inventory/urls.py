from django.urls import path
from . import views

urlpatterns = [
    path("", views.inventory_list),
    path("low-stock/", views.low_stock),
]

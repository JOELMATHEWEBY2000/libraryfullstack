from django.urls import path
from . import views

urlpatterns = [
    path("sales/", views.sales_report),
    path("rentals/", views.rentals_report),
    path("revenue/", views.revenue_report),
    path("popularity/", views.book_popularity_report),
]

from django.urls import path
from . import views

urlpatterns = [
    path("insights/", views.dashboard_insights),
    path("revenue-chart/", views.revenue_chart),
    path("purchase-stats/", views.purchase_stats),
    path("low-stock/", views.low_stock_list),
    path("pending-returns/", views.pending_returns_list),
]

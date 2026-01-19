from django.urls import path
from .views import (
    WishlistListView,
    WishlistAddView,
    WishlistToggleView,
    WishlistUpdateView,
    WishlistDeleteView,
)

urlpatterns = [
    path("", WishlistListView.as_view()),                  # GET all
    path("add/", WishlistAddView.as_view()),               # POST add
    path("toggle/", WishlistToggleView.as_view()),         # POST toggle
    path("update/<int:id>/", WishlistUpdateView.as_view()),# PUT update
    path("delete/<int:id>/", WishlistDeleteView.as_view()),# DELETE remove
]

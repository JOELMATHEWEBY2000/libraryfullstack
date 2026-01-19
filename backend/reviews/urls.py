# reviews/urls.py
from django.urls import path
from .views import BookReviewsView

urlpatterns = [
    path("view/<int:book_id>/", BookReviewsView.as_view()),
]

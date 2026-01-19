from django.urls import path
from .views import UserLibraryView

urlpatterns = [
    path("library/", UserLibraryView.as_view()),
]

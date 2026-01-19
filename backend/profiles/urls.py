from django.urls import path
from .views import (
    ProfileView,
    ProfileAddView,
    ProfileUpdateView,
    ProfileDeleteView
)

urlpatterns = [
    path("view/", ProfileView.as_view(), name="profile-detail"),
    path("add/", ProfileAddView.as_view(), name="profile-add"),
    path("update/", ProfileUpdateView.as_view(), name="profile-update"),
    path("delete/", ProfileDeleteView.as_view(), name="delete-profile"),

]

from django.urls import path
from .views import RegisterCreateView, ProfileView, LoginView, UsersListView, UpdateUserStatusView, DeleteUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/create/", RegisterCreateView.as_view()),
    path("login/", LoginView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("view/", UsersListView.as_view(), name="list-users"),
    path("<int:pk>/status/", UpdateUserStatusView.as_view(), name="update-user-status"),
    path("<int:pk>/delete/", DeleteUserView.as_view(), name="delete-user"),
]

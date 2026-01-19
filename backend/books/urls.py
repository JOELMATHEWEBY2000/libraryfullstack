from django.urls import path
from .views import (
    BookViewSet,
    BookListCreateView,
    BookUpdateDeleteView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("view/", BookViewSet.as_view({"get": "list"})),
    path("add/", BookListCreateView.as_view()),
    path("<int:pk>/", BookUpdateDeleteView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

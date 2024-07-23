from django.urls import path
from .views import ImageUploadView

urlpatterns = [
    path('get_post_objects/', ImageUploadView.as_view(), name='get_post_objects'),
]

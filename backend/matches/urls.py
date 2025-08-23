from django.urls import path
from .views import ImageUploadView, GetAIMatchesView, InteractAIMatchView

urlpatterns = [
    path('get_post_objects/', ImageUploadView.as_view(), name='get_post_objects'), #
    path('ai-matches/', GetAIMatchesView.as_view(), name='get_ai_matches'),
    path('ai-matches/<int:match_id>/interact/', InteractAIMatchView.as_view(), name='interact_ai_match'),
]

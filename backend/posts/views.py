from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer #
from django.utils import timezone
from datetime import timedelta
from matches.controllers import detect_objects, infer_interests_from_objects #

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        now = timezone.now()
        return Post.objects.filter(
            created_at__gte=now - timedelta(hours=24),
            user__expires_at__gte=now 
        ).order_by('-created_at')

    def perform_create(self, serializer):
        post_instance = serializer.save(user=self.request.user)
        if post_instance.image:
            try:
                image_path = post_instance.image.path 
                
                detected_obj_list_of_dicts = detect_objects(image_path)
                detected_labels = [obj['label'] for obj in detected_obj_list_of_dicts if 'label' in obj]

                inferred_interest_list = []
                if detected_labels:
                    inferred_interest_list = infer_interests_from_objects(detected_labels)
                
                post_instance.detected_objects = detected_obj_list_of_dicts
                post_instance.inferred_interests = inferred_interest_list
                post_instance.save()

            except Exception as e:
                print(f"Error during AI processing for post {post_instance.id}: {e}")

from django.db import models
from django.conf import settings
from django.utils import timezone

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    image = models.ImageField(upload_to='posts/') 
    created_at = models.DateTimeField(auto_now_add=True)
    detected_objects = models.JSONField(null=True, blank=True, help_text="Objects detected in the image by AI")
    inferred_interests = models.JSONField(null=True, blank=True, help_text="Interests inferred from objects by AI")

    def __str__(self):
        return f"Post by {self.user.username} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
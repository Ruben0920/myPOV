from django.db import models
from django.conf import settings

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts/') #bit 64 encoding i think 
    detected_objects = models.JSONField(null=True, blank=True)
    assumed_interests = models.JSONField(default=list, blank=True)
    tags = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Add fields for detected objects and any other necessary data

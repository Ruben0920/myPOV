from django.db import models
from django.conf import settings

class Match(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='matches_as_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='matches_as_user2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

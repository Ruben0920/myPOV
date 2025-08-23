from django.db import models
from django.conf import settings

class Match(models.Model):
    MATCH_STATUS_CHOICES = [
        ('pending', 'Pending'), 
        ('pending_ai', 'Pending AI'),
        ('matched', 'Matched'),
        ('declined', 'Declined'),
        ('blocked', 'Blocked'),
    ]

    MATCH_TYPE_CHOICES = [
        ('MANUAL', 'Manual'),
        ('AI', 'AI Generated'),
    ]

    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='matches_as_user1', on_delete=models.CASCADE) 
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='matches_as_user2', on_delete=models.CASCADE) 
    status = models.CharField(max_length=20, choices=MATCH_STATUS_CHOICES, default='pending')
    score = models.FloatField(null=True, blank=True, help_text="Compatibility score, if applicable") #
    match_type = models.CharField(max_length=10, choices=MATCH_TYPE_CHOICES, default='MANUAL')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user1', 'user2')
        ordering = ['-updated_at']

    def __str__(self):
        return f"Match between {self.user1.username} and {self.user2.username} - {self.status} ({self.match_type})"
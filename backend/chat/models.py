from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Chat(models.Model):
    """
    Represents a conversation between two or more users.
    For MVP, we'll assume 1:1 chats based on a Match.
    """
    # participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chats') # Original
    # user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chats_as_user1', on_delete=models.CASCADE)
    # user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chats_as_user2', on_delete=models.CASCADE)
    # Instead of generic participants, link directly to a Match for 1:1 MVP
    match = models.OneToOneField('matches.Match', on_delete=models.CASCADE, related_name='chat_session', null=True, blank=True)
    

    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(default=timezone.now) # Tracks the last message time
    
    # expires_at = models.DateTimeField() # Calculated field, not stored directly if based on last_activity + 24h

    def get_participants(self):
        if self.match:
            return [self.match.user1, self.match.user2]
        return []

    @property
    def is_expired(self):
        """Checks if the chat has expired (24 hours of inactivity)."""
        return timezone.now() > self.last_activity + timedelta(hours=24)

    def __str__(self):
        if self.match:
            return f"Chat for Match ID {self.match.id} between {self.match.user1.username} and {self.match.user2.username}"
        return f"Chat ID {self.id} (no match linked)"
        
    class Meta:
        ordering = ['-last_activity']


class ChatMessage(models.Model):
    """
    Represents a single message within a chat.
    """
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    # read_at = models.DateTimeField(null=True, blank=True) # For read receipts (post-MVP)

    def __str__(self):
        return f"Message from {self.sender.username} in Chat {self.chat.id} at {self.timestamp}"

    class Meta:
        ordering = ['timestamp']
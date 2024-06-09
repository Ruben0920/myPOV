from rest_framework import serializers

from socialapp.myapp.users.serializers import UserSerializer
from .models import Chat, ChatMessage
from users.models import CustomUser

class ChatSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'participants', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'chat', 'sender', 'message', 'timestamp']
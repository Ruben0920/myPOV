from rest_framework import serializers
from .models import Chat, ChatMessage
from users.serializers import CustomUserSerializer
from matches.serializers import MatchSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = CustomUserSerializer(read_only=True)
    sender_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'chat', 'sender', 'sender_id', 'content', 'timestamp']
        read_only_fields = ['id', 'chat', 'sender', 'timestamp']

    def create(self, validated_data):
        # sender_id handled in view request.user
        return ChatMessage.objects.create(**validated_data)


class ChatSerializer(serializers.ModelSerializer):
    # participants = CustomUserSerializer(many=True, read_only=True)
    match = MatchSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    is_expired = serializers.ReadOnlyField()

    match_id = serializers.IntegerField(write_only=True, required=False) 

    class Meta:
        model = Chat
        fields = ['id', 'match', 'match_id', 'created_at', 'last_activity', 'is_expired', 'last_message']
        read_only_fields = ['id', 'created_at', 'last_activity', 'is_expired', 'last_message', 'match']

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-timestamp').first()
        if last_msg:
            return ChatMessageSerializer(last_msg).data
        return None

    def create(self, validated_data):
        match_id = validated_data.pop('match_id', None)
        if match_id:
            pass
        return super().create(validated_data)
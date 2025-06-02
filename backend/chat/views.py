from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Chat, ChatMessage
from .serializers import ChatSerializer, ChatMessageSerializer
from matches.models import Match 
from .services.pusher_service import trigger_new_message, trigger_chat_updated


class ListCreateChatsView(generics.ListAPIView):
    """
    Lists active chats for the current user.
    Chat creation is implicitly handled when the first message is sent to a match
    or can be initiated here if a chat for a match doesn't exist.
    """
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        now = timezone.now()
        if user.expires_at < now: 
            return Chat.objects.none()

        active_chats = Chat.objects.filter(
            Q(match__user1=user) | Q(match__user2=user),
            match__status='matched'
        ).distinct()
        
        # filter out expired chats
        non_expired_chats = [
            chat for chat in active_chats if not chat.is_expired
        ]
        return sorted(non_expired_chats, key=lambda c: c.last_activity, reverse=True)


class RetrieveChatMessagesView(generics.ListAPIView):
    """
    Retrieves messages for a specific chat.
    Ensures the user is a participant and the chat/user accounts are not expired.
    """
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    # pagination_class = YourPaginationClass # Add pagination for messages

    def get_queryset(self):
        user = self.request.user
        chat_id = self.kwargs.get('chat_id')
        now = timezone.now()

        if user.expires_at < now:
            return ChatMessage.objects.none()

        chat = get_object_or_404(Chat, id=chat_id)

        participants = chat.get_participants()
        if user not in participants or chat.is_expired:
            return ChatMessage.objects.none() 
        
        for participant in participants:
            if participant.expires_at < now:
                return ChatMessage.objects.none()

        return chat.messages.all().order_by('timestamp')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists() and queryset.model is ChatMessage and ChatMessage.objects.none().count() == 0 : # a bit hacky check if it was intentionally made empty
             chat_id = self.kwargs.get('chat_id')
             chat = get_object_or_404(Chat, id=chat_id)
             if chat.is_expired:
                 return Response({"detail": "This chat has expired."}, status=status.HTTP_403_FORBIDDEN)
             if request.user not in chat.get_participants():
                 return Response({"detail": "You do not have access to this chat."}, status=status.HTTP_403_FORBIDDEN)
             # Check if any participant's account is expired
             for p in chat.get_participants():
                 if p.expires_at < timezone.now():
                     return Response({"detail": "Chat involves an expired user account."}, status=status.HTTP_403_FORBIDDEN)


        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CreateChatMessageView(generics.CreateAPIView):
    """
    Creates a new message in a chat.
    If a chat for the given match_id doesn't exist, it can be created.
    """
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        match_id = self.request.data.get('match_id')
        content = self.request.data.get('content')
        now = timezone.now()

        if hasattr(user, 'expires_at') and user.expires_at < now:
            raise PermissionDenied("Your account has expired.")

        if not match_id or not content:
            raise ValidationError("Match ID and content are required.")

        match = get_object_or_404(Match, id=match_id, status='matched')

        if user != match.user1 and user != match.user2:
            raise PermissionDenied("You are not part of this match.")
        
        if (hasattr(match.user1, 'expires_at') and match.user1.expires_at < now) or \
           (hasattr(match.user2, 'expires_at') and match.user2.expires_at < now):
            raise PermissionDenied("One or both user accounts in this match have expired.")

        chat, created = Chat.objects.get_or_create(
            match=match,
            defaults={'last_activity': now}
        )

        message = serializer.save(sender=user, chat=chat, content=content)

        chat.last_activity = message.timestamp
        chat.save()

        message_data = ChatMessageSerializer(message).data
        trigger_new_message(chat.id, message_data)

        chat_summary_data = ChatSerializer(chat).data
        for participant in chat.get_participants():
            if participant != user:
                 trigger_chat_updated(participant.id, chat_summary_data)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except PermissionDenied as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
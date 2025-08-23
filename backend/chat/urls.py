from django.urls import path
from .views import (
    ListCreateChatsView, 
    RetrieveChatMessagesView, 
    CreateChatMessageView
)

urlpatterns = [
    path('', ListCreateChatsView.as_view(), name='list_create_chats'),
    path('messages/send/', CreateChatMessageView.as_view(), name='create_chat_message'),
    path('<int:chat_id>/messages/', RetrieveChatMessagesView.as_view(), name='retrieve_chat_messages'),
]
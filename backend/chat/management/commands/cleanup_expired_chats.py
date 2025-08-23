from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from chat.models import Chat, ChatMessage

class Command(BaseCommand):
    help = 'Deletes messages in chats that have been inactive for more than 24 hours, or entire chats.'

    def handle(self, *args, **options):
        now = timezone.now()
        expiration_threshold = now - timedelta(hours=24) # Activity older than this means expired

        # Find chats where last_activity is older than the threshold
        expired_chats = Chat.objects.filter(last_activity__lt=expiration_threshold)
        
        count_chats_processed = 0
        count_messages_deleted = 0

        for chat in expired_chats:
            # Option 1: Delete all messages in the expired chat
            messages_to_delete = ChatMessage.objects.filter(chat=chat)
            count_messages_deleted += messages_to_delete.count()
            messages_to_delete.delete()
            
            # Option 2: Delete the chat itself (which would cascade delete messages)
            # chat.delete() 
            # For now, let's just clear messages to keep the chat record but empty it.
            # Or, you could add an `is_archived` flag to the Chat model.

            self.stdout.write(self.style.SUCCESS(f'Processed expired chat ID {chat.id}. Messages cleared.'))
            count_chats_processed +=1

        if count_chats_processed > 0:
            self.stdout.write(self.style.SUCCESS(f'Successfully processed {count_chats_processed} expired chats. Deleted {count_messages_deleted} messages.'))
        else:
            self.stdout.write(self.style.SUCCESS('No expired chats to process.'))
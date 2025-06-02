from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from posts.models import Post
from users.models import CustomUser 

class Command(BaseCommand):
    help = 'Deletes posts older than 24 hours and handles expired user accounts.'

    def handle(self, *args, **options):
        now = timezone.now()
        twenty_four_hours_ago = now - timedelta(hours=24)

        expired_posts = Post.objects.filter(created_at__lt=twenty_four_hours_ago)
        count_expired_posts = expired_posts.count()
        if count_expired_posts > 0:
            expired_posts.delete() # Or mark as expired: expired_posts.update(is_expired=True)
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count_expired_posts} expired posts.'))
        else:
            self.stdout.write(self.style.SUCCESS('No expired posts to delete.'))
        expired_users = CustomUser.objects.filter(expires_at__lt=now, is_active=True)
        count_expired_users = expired_users.count()
        if count_expired_users > 0:
            for user in expired_users:
                user.is_active = False 
                user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully marked {count_expired_users} expired user accounts as inactive.'))
        else:
            self.stdout.write(self.style.SUCCESS('No user accounts newly expired to mark as inactive.'))

        self.stdout.write(self.style.SUCCESS('Expiry cleanup process finished.'))
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    user_gender = models.CharField(blank=True, null=True)
    interests = models.ManyToManyField('Interest', related_name='users', blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',  # Changed related_name to be unique
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',  # Changed related_name to be unique
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    otp_code = models.CharField(max_length=6, null=True, blank=True)
    otp_expiration = models.DateTimeField(null=True, blank=True)
    otp_attempts = models.IntegerField(default=3)
    

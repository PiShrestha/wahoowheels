from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=False)
    is_active = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notes")

    def __str__(self) -> str:
        return self.title
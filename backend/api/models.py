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
  
from django.contrib.auth.models import User
from django.db import models

class Ride(models.Model):
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rides_offered")
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    from_lat = models.FloatField(blank=True, null=True)  # Latitude of starting point
    from_lon = models.FloatField(blank=True, null=True)  # Longitude of starting point
    to_lat = models.FloatField(blank=True, null=True)  # Latitude of destination
    to_lon = models.FloatField(blank=True, null=True)  # Longitude of destination
    date = models.DateField()
    time = models.TimeField()
    seats_available = models.PositiveIntegerField(default=1)
    seats_taken = models.PositiveIntegerField(default=0)
    luggage_capacity = models.CharField(max_length=50, blank=True, null=True)
    additional_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def remaining_seats(self):
        return self.seats_available - self.seats_taken

    def save(self, *args, **kwargs):
        if self.seats_taken > self.seats_available:
            raise ValueError("No available seats left.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.driver.username}: {self.from_location} → {self.to_location} ({self.remaining_seats()} seats left)"


class Booking(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name="bookings")
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rides_booked")
    status_choices = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("declined", "Declined"),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default="pending")
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.ride.remaining_seats() <= 0:
            raise ValueError("No available seats left.")
        super().save(*args, **kwargs)
        self.ride.seats_taken += 1
        self.ride.save()

    def __str__(self):
        return f"{self.passenger.username} booked {self.ride} ({self.status})"

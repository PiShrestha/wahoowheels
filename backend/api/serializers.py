from rest_framework import serializers
from .models import Note
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
from .models import Ride, Booking

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        
class RideSerializer(serializers.ModelSerializer):
    driver = serializers.ReadOnlyField(source="driver.username")
    seats_taken = serializers.IntegerField(read_only=True)
    remaining_seats = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = [
            "id", "driver", "from_location", "to_location",
            "from_lat", "from_lon", "to_lat", "to_lon",
            "date", "time", "seats_available", "seats_taken",
            "remaining_seats", "luggage_capacity", "additional_notes", "created_at"
        ]

    def get_remaining_seats(self, obj):
        return obj.remaining_seats()


class BookingSerializer(serializers.ModelSerializer):
    passenger = serializers.ReadOnlyField(source="passenger.username")

    class Meta:
        model = Booking
        fields = ["id", "ride", "passenger", "status", "message", "created_at"]

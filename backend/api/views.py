from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import NoteSerializer, UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from math import radians, cos, sin, asin, sqrt
from datetime import timedelta, date
from .models import Ride, Booking
from .serializers import RideSerializer, BookingSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .models import CustomUser
from .tokens import account_activation_token
from django.shortcuts import redirect



class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        #return all notes would be: Notes.objects.all()
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        #return all notes would be: Notes.objects.all()
        return Note.objects.filter(author=user)

##############################################################################

# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]


class RegisterView(APIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            mail_subject = 'Activate your account.'
            message = render_to_string('/Users/haydenrobinette/Desktop/HackDowntown/wahoowheels/backend/templates/api/activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.send()
            return Response({'message': 'Please confirm your email address to complete the registration'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActivateAccount(APIView):
    permission_classes = [AllowAny]
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.email_verified = True
            user.save()
            return redirect(f'http://localhost:5173/login')
        else:
            return redirect(f'http://localhost:5173/register')

##########################################################################

def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great-circle distance between two points on the Earth."""
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return R * c  # Distance in km

class RideListCreate(generics.ListCreateAPIView):
    serializer_class = RideSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filters rides based on:
        - Closest `from_location` using latitude & longitude
        - Closest `date`
        - Soonest rides ordering
        """
        queryset = Ride.objects.all()
        from_lat = self.request.query_params.get("from_lat")
        from_lon = self.request.query_params.get("from_lon")
        to_lat = self.request.query_params.get("to_lat")
        to_lon = self.request.query_params.get("to_lon")
        date_str = self.request.query_params.get("date")

        if from_lat and from_lon:
            from_lat, from_lon = float(from_lat), float(from_lon)
            queryset = sorted(queryset, key=lambda ride: haversine(from_lat, from_lon, ride.from_lat, ride.from_lon))

        if to_lat and to_lon:
            to_lat, to_lon = float(to_lat), float(to_lon)
            queryset = sorted(queryset, key=lambda ride: haversine(to_lat, to_lon, ride.to_lat, ride.to_lon))

        # If a date is provided, find closest match (± 2 days)
        if date_str:
            try:
                target_date = date.fromisoformat(date_str)
                date_range = [target_date - timedelta(days=2), target_date + timedelta(days=2)]
                queryset = [ride for ride in queryset if date_range[0] <= ride.date <= date_range[1]]
            except ValueError:
                pass  # Ignore invalid date format

        return queryset

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(driver=self.request.user)
        else:
            print(serializer.errors)

class RideDelete(generics.DestroyAPIView):
    serializer_class = RideSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ride.objects.filter(driver=self.request.user)

class BookingListCreate(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(passenger=self.request.user)

    def perform_create(self, serializer):
        ride = serializer.validated_data["ride"]
        if ride.remaining_seats() <= 0:
            raise ValueError("No available seats left.")
        if serializer.is_valid():
            serializer.save(passenger=self.request.user)
            ride.seats_taken += 1
            ride.save()
        else:
            print(serializer.errors)

class BookingDelete(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(passenger=self.request.user)
from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
    path('activate/<uidb64>/<token>/', views.ActivateAccount.as_view(), name='activate'),,
    path('rides/', views.RideListCreate.as_view(), name="ride-list"),
    path('rides/delete/<int:pk>/', views.RideDelete.as_view(), name="ride-delete"),
    path("bookings/", views.BookingListCreate.as_view(), name="booking-list"),
    path("bookings/delete/<int:pk>/", views.BookingDelete.as_view(), name="booking-delete"),
]
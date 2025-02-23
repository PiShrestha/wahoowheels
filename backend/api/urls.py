from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
    path('activate/<uidb64>/<token>/', views.ActivateAccount.as_view(), name='activate'),
]
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Table, Button, Container, Alert } from 'react-bootstrap';

const Bookings = () => {
    const [drives, setDrives] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsResponse = await api.get('/api/bookings/');
      const bookingsWithRides = await Promise.all(
        bookingsResponse.data.map(async (booking) => {
          const rideResponse = await api.get(`/api/rides/${booking.ride}/`);
          return {
            ...booking,
            rideDetails: rideResponse.data
          };
        })
      );
      setBookings(bookingsWithRides);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    }
  };
  

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/api/bookings/delete/${bookingId}/`);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      } catch (err) {
        setError('Failed to cancel booking. Please try again later.');
        console.error('Error cancelling booking:', err);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1>My Bookings</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {bookings.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                <tr key={booking.id}>
                    <td>{booking.rideDetails?.from_location}</td>
                    <td>{booking.rideDetails?.to_location}</td>
                    <td>{booking.rideDetails?.date}</td>
                    <td>{booking.rideDetails?.time}</td>
                    <td>{booking.status}</td>
                    <td>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDeleteBooking(booking.id)}
                    >
                        Cancel
                    </Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Bookings;
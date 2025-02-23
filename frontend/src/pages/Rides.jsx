import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { Table, Button, Container, Accordion } from "react-bootstrap";
import "../styles/RideList.css";

function RidesList() {
  const [rides, setRides] = useState([]);
  const [requestedRides, setRequestedRides] = useState(new Set());
  const [expandedRide, setExpandedRide] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pickup = queryParams.get("pickup");
  const dropoff = queryParams.get("dropoff");
  const date = queryParams.get("date");
  const time = queryParams.get("time");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const params = {};
        if (pickup) params.from_location = pickup;
        if (dropoff) params.to_location = dropoff;
        if (date) params.date = date;
        if (time) params.time = time;
  
        const response = await api.get("/api/rides/", { params });
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
  
    fetchRides();
  }, [pickup, dropoff, date, time]);

  const handleRequestRide = async (rideId) => {
    try {
      // Make the API request to add a passenger
      const response = await api.post(`/api/rides/${rideId}/add_passenger/`);
      setRequestedRides(prev => new Set([...prev, rideId]));

      fetchRides()
      if (response.status === 200) {
        alert("Ride requested successfully!");
      }
    } catch (error) {
    }
  };

  const toggleDetails = (rideId) => {
    setExpandedRide(expandedRide === rideId ? null : rideId);
  };

  // Format date (removing year)
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const options = { month: '2-digit', day: '2-digit' }; // Format like MM-DD
    return dateObj.toLocaleDateString(undefined, options);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Available Rides</h2>
      <h4 className="search-summary">
        Showing results for{" "}
        <strong>{pickup ? pickup : "Any"}</strong> →{" "}
        <strong>{dropoff ? dropoff : "Any"}</strong>
        <strong>{date ? `, within 2 days of ${date}` : ""}</strong> 
        <strong>{time ? ` around ${time}` : ""}</strong>
      </h4>

      {rides.length === 0 ? (
        <p className="text-center">
          No rides found. Try modifying your search.
        </p>
      ) : (
        <Table className="table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Date</th> {/* Added Date column */}
              <th>Time</th>
              <th>Seats Available</th>
              <th>Expand</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <React.Fragment key={ride.id}>
                <tr>
                  <td>{ride.driver}</td>
                  <td>{ride.from_location}</td>
                  <td>{ride.to_location}</td>
                  <td>{formatDate(ride.date)}</td> {/* Display formatted date */}
                  <td>{ride.time}</td>
                  <td>{`${ride.seats_available-ride.seats_taken}`}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => toggleDetails(ride.id)}
                    >
                      {expandedRide === ride.id ? "▲" : "▼"}
                    </Button>
                  </td>
                </tr>
                {expandedRide === ride.id && (
                  <tr>
                    <td colSpan="7">
                      <div className="ride-details">
                        <p><strong>Car Model:</strong> {ride.car_model}</p>
                        <p><strong>Luggage Capacity:</strong> {ride.luggage_capacity}</p>
                        <Button
                          variant={requestedRides.has(ride.id) ? "secondary" : "primary"}
                          onClick={() => handleRequestRide(ride.id)}
                          disabled={requestedRides.has(ride.id)}
                        >
                          {requestedRides.has(ride.id) ? "Requested" : "Request Ride"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default RidesList;

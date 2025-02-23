import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

function RidesList() {
  const [rides, setRides] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pickup = queryParams.get("pickup");
  const dropoff = queryParams.get("dropoff");
  const date = queryParams.get("date");
  const time = queryParams.get("time");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get("/api/rides/", {
          params: { from_location: pickup, to_location: dropoff, date, time },
        });
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, [pickup, dropoff, date, time]);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Available Rides</h2>
      {rides.length === 0 ? (
        <p className="text-center">No rides found. Try modifying your search.</p>
      ) : (
        <Row className="g-4">
          {rides.map((ride) => (
            <Col md={6} lg={4} key={ride.id}>
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>
                    <strong>{ride.driver}</strong>
                  </Card.Title>
                  <Card.Text>
                    <strong>From:</strong> {ride.from_location} <br />
                    <strong>To:</strong> {ride.to_location} <br />
                    <strong>Date:</strong> {ride.date} <br />
                    <strong>Time:</strong> {ride.time} <br />
                    <strong>Seats Left:</strong> {ride.remaining_seats} <br />
                  </Card.Text>
                  <Button variant="success" className="w-100">
                    Request Ride
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default RidesList;

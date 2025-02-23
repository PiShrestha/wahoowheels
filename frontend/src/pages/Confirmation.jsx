import React from "react";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";

function Confirmation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pickup = queryParams.get("pickup");
  const dropoff = queryParams.get("dropoff");
  const date = queryParams.get("date");
  const time = queryParams.get("time");

  return (
    <Container className="vh-100 mt-5 text-center">
      <h2>Ride Listed Successfully!</h2>
      <p><strong>Pickup:</strong> {pickup}</p>
      <p><strong>Dropoff:</strong> {dropoff}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {time}</p>
    </Container>
  );
}

export default Confirmation;

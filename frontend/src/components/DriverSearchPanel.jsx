import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function DriverSearchPanel({
  onSearch,
  onDropoffSearch,
  onClearPickup,
  onClearDropoff,
  TOKEN,
}) {
  const [pickup, setPickup] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoff, setDropoff] = useState("");
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  //date & time
  const [rideDate, setRideDate] = useState("");
  const [rideTime, setRideTime] = useState("");

  // Extra fields for driver mode
  const [vehicleModel, setVehicleModel] = useState("");
  const [luggageCap, setLuggageCap] = useState("");
  const [seats, setSeats] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePickupInputChange = async (e) => {
    const query = e.target.value;
    setPickup(query);
    if (query.length > 2) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?autocomplete=true&access_token=${TOKEN}`
      );
      const data = await response.json();
      if (data.features) {
        setPickupSuggestions(data.features);
      }
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleSelectPickupSuggestion = (place) => {
    setPickup(place.place_name);
    setPickupSuggestions([]);
    onSearch(place.place_name);
  };

  const handleDropoffInputChange = async (e) => {
    const query = e.target.value;
    setDropoff(query);
    if (query.length > 2) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?autocomplete=true&access_token=${TOKEN}`
      );
      const data = await response.json();
      if (data.features) {
        setDropoffSuggestions(data.features);
      }
    } else {
      setDropoffSuggestions([]);
    }
  };

  const handleSelectDropoffSuggestion = (place) => {
    setDropoff(place.place_name);
    setDropoffSuggestions([]);
    onDropoffSearch(place.place_name);
  };

  const handleClearPickup = () => {
    setPickup("");
    setPickupSuggestions([]);
    onClearPickup();
  };

  const handleClearDropoff = () => {
    setDropoff("");
    setDropoffSuggestions([]);
    onClearDropoff();
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await api.post("/api/rides/", {
        // Matches Django field in models.Ride
        from_location: pickup,
        to_location: dropoff,
        date: rideDate,
        time: rideTime,
        vehicle_model: vehicleModel,
        luggage_capacity: luggageCap,
        seats_available: seats,
      });

      if (response.status === 201) {
        console.log("Ride listed successfully!");
        navigate("/");
      } else {
        alert(`Error: ${response.data.message || "Failed to list ride."}`);
      }
    } catch (error) {
      alert("Failed to connect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-start"
      style={{ width: "85%" }}
    >
      {/* Pickup Input */}
      <div className="position-relative mb-3">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Pickup location"
            value={pickup}
            onChange={handlePickupInputChange}
          />
          {pickup && (
            <button
              type="button"
              className="btn btn-sm btn-secondary ms-2"
              onClick={handleClearPickup}
            >
              X
            </button>
          )}
        </div>
        {pickupSuggestions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ zIndex: 9999 }}
          >
            {pickupSuggestions.map((place) => (
              <li
                key={place.id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectPickupSuggestion(place)}
              >
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dropoff Input */}
      <div className="position-relative mb-3">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Dropoff location"
            value={dropoff}
            onChange={handleDropoffInputChange}
          />
          {dropoff && (
            <button
              type="button"
              className="btn btn-sm btn-secondary ms-2"
              onClick={handleClearDropoff}
            >
              X
            </button>
          )}
        </div>
        {dropoffSuggestions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ zIndex: 9999 }}
          >
            {dropoffSuggestions.map((place) => (
              <li
                key={place.id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectDropoffSuggestion(place)}
              >
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ride Date & Time */}
      <div className="row g-2 mb-3 align-items-end">
        {/* Date Field */}
        <div className="col">
          <label htmlFor="rideDate" className="form-label fw-semibold">
            Date
          </label>
          <div className="input-group">
            {/* Optional icon (Bootstrap Icons) */}
            <span className="input-group-text">
              <i className="bi bi-calendar3"></i>
            </span>
            <input
              type="date"
              id="rideDate"
              className="form-control"
              value={rideDate}
              onChange={(e) => setRideDate(e.target.value)}
            />
          </div>
        </div>

        {/* Time Field */}
        <div className="col">
          <label htmlFor="rideTime" className="form-label fw-semibold">
            Time
          </label>
          <div className="input-group">
            {/* Optional icon (Bootstrap Icons) */}
            <span className="input-group-text">
              <i className="bi bi-clock"></i>
            </span>
            <input
              type="time"
              id="rideTime"
              className="form-control"
              value={rideTime}
              onChange={(e) => setRideTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Extra fields for drivers */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Vehicle Model (e.g., Toyota Camry)"
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Number of Seats Available"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Luggage Capacity"
          value={luggageCap}
          onChange={(e) => setLuggageCap(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-dark w-100" onClick={handleSubmit}>
        List Ride
      </button>
    </div>
  );
}

export default DriverSearchPanel;

import React, { useState, useEffect } from "react";

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

  // Extra fields for driver mode
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass an object containing both common and driver-specific fields.
    onSearch({ pickup, dropoff, vehicleModel, licensePlate });
  };

  return (
    <div
      className="bg-light d-flex flex-column justify-content-start"
      style={{ width: "95%" }}
    >
      <h2 className="fw-bold font-monospace">List a ride</h2>

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
              className="btn btn-sm btn-danger ms-2"
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
              className="btn btn-sm btn-danger ms-2"
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

      <select className="form-select mb-2">
        <option>Pickup now</option>
        <option>Schedule for later</option>
      </select>

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
          placeholder="License Plate (e.g., ABC-1234)"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
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

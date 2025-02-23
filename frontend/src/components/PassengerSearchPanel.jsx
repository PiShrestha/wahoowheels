import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PassengerSearchPanel({
  onSearch,
  onDropoffSearch,
  onClearPickup,
  onClearDropoff,
  TOKEN,
}) {
  // Pickup & dropoff fields + suggestions
  const [pickup, setPickup] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoff, setDropoff] = useState("");
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  // New fields: date & time
  const [rideDate, setRideDate] = useState("");
  const [rideTime, setRideTime] = useState("");

  const navigate = useNavigate();

  // Fetch suggestions for pickup
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

  // Select pickup suggestion
  const handleSelectPickupSuggestion = (place) => {
    setPickup(place.place_name);
    setPickupSuggestions([]);
    onSearch(place.place_name); // or pass entire object if desired
  };

  // Fetch suggestions for dropoff
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

  // Select dropoff suggestion
  const handleSelectDropoffSuggestion = (place) => {
    setDropoff(place.place_name);
    setDropoffSuggestions([]);
    onDropoffSearch(place.place_name); // or pass entire object if desired
  };

  // Clear the pickup input & marker
  const handleClearPickup = () => {
    setPickup("");
    setPickupSuggestions([]);
    onClearPickup();
  };

  // Clear the dropoff input & marker
  const handleClearDropoff = () => {
    setDropoff("");
    setDropoffSuggestions([]);
    onClearDropoff();
  };

  // Optional: If you want to pass date/time in your final onSearch call
  const handleSearchClick = () => {
    // Combine the date/time with pickup if needed
    const searchData = {
      pickup,
      dropoff,
      rideDate,
      rideTime,
    };
    // If your parent wants only pickup as a string, you can keep it as before
    // or pass the entire searchData object:
    onSearch(searchData);
    navigate(
      `/rides?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(
        dropoff
      )}&date=${rideDate}&time=${rideTime}`
    );
  };

  return (
    <div
      className="d-flex flex-column justify-content-start"
      style={{ width: "85%" }}
    >

      {/* Pickup */}
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

      {/* Dropoff */}
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

      {/* Search Button */}
      <button className="btn btn-dark w-100" onClick={handleSearchClick}>
        Search
      </button>
    </div>
  );
}

export default PassengerSearchPanel;

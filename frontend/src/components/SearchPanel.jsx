import { useState } from "react";

function SearchPanel({
  onSearch,
  onDropoffSearch,
  onClearPickup,
  onClearDropoff,
  TOKEN,
}) {
  // State for pickup input & suggestions
  const [pickup, setPickup] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  
  // State for dropoff input & suggestions
  const [dropoff, setDropoff] = useState("");
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  // Fetch suggestions for pickup
  const handlePickupInputChange = async (e) => {
    const query = e.target.value;
    setPickup(query);
    // if the user has typed more than 2 characters before making a request
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
    onSearch(place.place_name);
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
    onDropoffSearch(place.place_name);
  };

  // Clear the pickup input & marker
  const handleClearPickup = () => {
    setPickup("");
    setPickupSuggestions([]); // Hide suggestions
    onClearPickup();
  };

  // Clear the dropoff input & marker
  const handleClearDropoff = () => {
    setDropoff("");
    setDropoffSuggestions([]); // Hide suggestions
    onClearDropoff();
  };

  return (
    <div
      className="bg-light m-4 p-4 d-flex flex-column justify-content-start"
      style={{ width: "35%" }}
    >
      <h2 className="fw-bold font-monospace">Search for a ride</h2>

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

      {/* Optional: triggers pickup search if user typed an address but didn't select a suggestion */}
      <button className="btn btn-dark w-100" onClick={() => onSearch(pickup)}>
        Search
      </button>
    </div>
  );
}

export default SearchPanel;

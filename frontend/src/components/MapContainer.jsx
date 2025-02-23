import { useState, useEffect } from "react";
import SearchPanel from "./UnifiedSearchPanel";
import MapView from "./MapView";

function MapContainer() {
  const INITIAL_CENTER = [-78.504, 38.034];
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(17);
  const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!TOKEN) {
    throw new Error("You need a Mapbox token");
  }

  // State for pickup, dropoff, and route
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [route, setRoute] = useState(null);

  // Geocode and update pickup
  const handlePickupSearch = async (address) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${TOKEN}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      // Update pickup coords and center the map
      setCenter([lng, lat]);
      setPickupCoords([lng, lat]);
    } else {
      alert("Pickup address not found!");
    }
  };

  // Geocode and update dropoff
  const handleDropoffSearch = async (address) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${TOKEN}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      setDropoffCoords([lng, lat]);
    } else {
      alert("Dropoff address not found!");
    }
  };

  // Fetch the route if both pickup and dropoff are set
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupCoords && dropoffCoords) {
        const query = `${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}`;
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${query}?geometries=geojson&access_token=${TOKEN}`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0].geometry);
        }
      } else {
        setRoute(null);
      }
    };
    fetchRoute();
  }, [pickupCoords, dropoffCoords, TOKEN]);

  // Clear markers
  const clearPickup = () => {
    setPickupCoords(null);
  };
  const clearDropoff = () => {
    setDropoffCoords(null);
  };

  return (
    <div className="d-flex vh-100">
      <SearchPanel
        onSearch={handlePickupSearch}
        onDropoffSearch={handleDropoffSearch}
        onClearPickup={clearPickup}
        onClearDropoff={clearDropoff}
        TOKEN={TOKEN}
      />
      <MapView
        center={center}
        setCenter={setCenter}
        setZoom={setZoom}
        zoom={zoom}
        TOKEN={TOKEN}
        pickupCoords={pickupCoords}
        dropoffCoords={dropoffCoords}
        route={route}
      />
    </div>
  );
}

export default MapContainer;

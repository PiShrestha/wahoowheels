import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function Map({ INITIAL_CENTER = [-74.0242, 40.6941] }) {
  const INITIAL_ZOOM = 12;
  const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!TOKEN) {
    throw new Error("You need a Mapbox token");
  }

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [address, setAddress] = useState("");

  useEffect(() => {
    mapboxgl.accessToken = TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapRef.current.getZoom());
    });

    return () => mapRef.current?.remove();
  }, []);

  // 🌍 Function to Convert Address to Coordinates
  const handleSearch = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${TOKEN}`
    );
    const data = await response.json();
    
    if (data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
      setCenter([lng, lat]);
    } else {
      alert("Address not found!");
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Search Sidebar (Left) */}
      <div className="bg-light p-4 w-25 d-flex flex-column justify-content-start">
        <h5 className="fw-bold">Get a ride</h5>
        
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Pickup location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input type="text" className="form-control mb-2" placeholder="Dropoff location" />

        <select className="form-select mb-2">
          <option>Pickup now</option>
          <option>Schedule for later</option>
        </select>

        <select className="form-select mb-3">
          <option>For me</option>
          <option>For someone else</option>
        </select>

        <button className="btn btn-dark w-100" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Map (Right) */}
      <div className="w-75 position-relative">
        <div ref={mapContainerRef} className="w-100 h-100" />

        {/* Info Box */}
        <div className="position-absolute top-0 start-0 font-monospace m-3 p-2 bg-secondary text-white rounded">
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default Map;

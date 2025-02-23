import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function MapView({
  center,
  zoom,
  setCenter,
  setZoom,
  TOKEN,
  pickupCoords,
  dropoffCoords,
  route,
}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Refs to store pins instances
  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);

  // State for the map style
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/standard");
  // Flag to ensure bounds are fitted only once when both pins are rendered,
  // so the map adjusts to include both markers without repeatedly re-fitting.
  const [hasFittedBounds, setHasFittedBounds] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = TOKEN;

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: center,
      zoom: zoom,
      pitch: 60,
      bearing: 25,
      maxPitch: 60, 
      dragRotate: true,
      interactive: true,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // Update state when user pans/zooms
    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapRef.current.getZoom());
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Update map style if changed in the dropdown
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Add or update pickup & dropoff markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Pickup marker (green)
    if (pickupCoords) {
      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = new mapboxgl.Marker({ color: "green" })
          .setLngLat(pickupCoords)
          .addTo(mapRef.current);
      } else {
        pickupMarkerRef.current.setLngLat(pickupCoords);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }

    // Dropoff marker (red)
    if (dropoffCoords) {
      if (!dropoffMarkerRef.current) {
        dropoffMarkerRef.current = new mapboxgl.Marker({ color: "red" })
          .setLngLat(dropoffCoords)
          .addTo(mapRef.current);
      } else {
        dropoffMarkerRef.current.setLngLat(dropoffCoords);
      }
    } else if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }
  }, [pickupCoords, dropoffCoords]);

  // Add or update route
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing route if present
    if (mapRef.current.getLayer("route")) {
      mapRef.current.removeLayer("route");
    }
    if (mapRef.current.getSource("route")) {
      mapRef.current.removeSource("route");
    }

    // If we have a route, add it
    if (route) {
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route,
        },
      });
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 6,
        },
      });
    }
  }, [route]);

  // Auto-center/fly to markers
  useEffect(() => {
    if (!mapRef.current) return;

    // If both coords exist, fit bounds once
    if (pickupCoords && dropoffCoords) {
      if (!hasFittedBounds) {
        const bounds = new mapboxgl.LngLatBounds(pickupCoords, pickupCoords);
        bounds.extend(dropoffCoords);
        mapRef.current.fitBounds(bounds, { padding: 125, duration: 1000 });
        setHasFittedBounds(true);
      }
    }
    // If only pickup coords exist, fly to them
    else if (pickupCoords) {
      mapRef.current.flyTo({ center: pickupCoords, zoom: 15, duration: 1000 });
      setHasFittedBounds(false);
    }
    // If only dropoff coords exist, fly to them
    else if (dropoffCoords) {
      mapRef.current.flyTo({ center: dropoffCoords, zoom: 15, duration: 1000 });
      setHasFittedBounds(false);
    }
  }, [pickupCoords, dropoffCoords, hasFittedBounds]);

  // Handler for style selection
  const handleStyleChange = (e) => {
    setMapStyle(e.target.value);
  };

  return (
    <div className="position-relative m-3 p-2" style={{ width: "60%" }}>
      <div ref={mapContainerRef} className="w-100 h-100" />
      <div className="position-absolute top-0 start-0 font-monospace m-4 p-2 bg-secondary text-white rounded">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <div className="position-absolute top-0 end-0 m-4">
        <select
          onChange={handleStyleChange}
          value={mapStyle}
          className="form-select"
        >
          <option value="mapbox://styles/mapbox/standard-satellite">
            Standard Satellite
          </option>
          <option value="mapbox://styles/mapbox/standard">Standard</option>
          <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
          <option value="mapbox://styles/mapbox/navigation-day-v1">
            Navigation Day
          </option>
        </select>
      </div>
    </div>
  );
}

export default MapView;

import React, { useState, useEffect, useRef } from "react";
import PassengerSearchPanel from "./PassengerSearchPanel";
import DriverSearchPanel from "./DriverSearchPanel";

function UnifiedSearchPanel({
  onSearch,
  onDropoffSearch,
  onClearPickup,
  onClearDropoff,
  TOKEN,
}) {
  const [mode, setMode] = useState("passenger");
  const prevMode = useRef(mode);

  // Clear markers only when the mode actually changes.
  useEffect(() => {
    if (prevMode.current !== mode) {
      onClearPickup();
      onClearDropoff();
      prevMode.current = mode;
    }
  }, [mode, onClearPickup, onClearDropoff]);

  return (
    <div
      className="position-relative rounded p-2"
      style={{
        left: "5%",
        top: "10%",
        width: "40%",
        zIndex: 9999,
      }}
    >
      <h1 className="fw-bold mb-3">
        {mode === "passenger" ? "Search for a ride" : "List a ride"}
      </h1>

      <div className="d-flex mb-4">
        <div className="btn-group" role="group" aria-label="Toggle mode">
          <input
            type="radio"
            className="btn-check"
            name="mode"
            id="passenger"
            autoComplete="off"
            checked={mode === "passenger"}
            onChange={() => setMode("passenger")}
          />
          <label
            className={`btn ${
              mode === "passenger" ? "btn-secondary" : "btn-outline-secondary"
            }`}
            htmlFor="passenger"
          >
            Passenger
          </label>

          <input
            type="radio"
            className="btn-check"
            name="mode"
            id="driver"
            autoComplete="off"
            checked={mode === "driver"}
            onChange={() => setMode("driver")}
          />
          <label
            className={`btn ${
              mode === "driver" ? "btn-secondary" : "btn-outline-secondary"
            }`}
            htmlFor="driver"
          >
            Driver
          </label>
        </div>
      </div>

      {/* Render the appropriate search panel based on mode */}
      {mode === "passenger" ? (
        <PassengerSearchPanel
          key="passenger" // forces remount on mode change
          onSearch={onSearch}
          onDropoffSearch={onDropoffSearch}
          onClearPickup={onClearPickup}
          onClearDropoff={onClearDropoff}
          TOKEN={TOKEN}
        />
      ) : (
        <DriverSearchPanel
          key="driver" // forces remount on mode change
          onSearch={onSearch}
          onDropoffSearch={onDropoffSearch}
          onClearPickup={onClearPickup}
          onClearDropoff={onClearDropoff}
          TOKEN={TOKEN}
        />
      )}
    </div>
  );
}

export default UnifiedSearchPanel;

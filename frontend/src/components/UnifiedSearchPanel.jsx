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
    <div className="bg-light m-4 p-4 rounded shadow" style={{ width: "30%" }}>
      <div className="mb-4">
        <label className="me-3 form-check-label">
          <input
            type="radio"
            value="passenger"
            checked={mode === "passenger"}
            onChange={() => setMode("passenger")}
          />{" "}
          Passenger
        </label>
        <label className="form-check-label">
          <input
            type="radio"
            value="driver"
            checked={mode === "driver"}
            onChange={() => setMode("driver")}
          />{" "}
          Driver
        </label>
      </div>
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

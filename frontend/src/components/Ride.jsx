import React from "react";

function Ride({ ride, onDelete }) {
    const formattedDate = new Date(ride.date).toLocaleDateString("en-US");
    const formattedTime = new Date(`1970-01-01T${ride.time}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="ride-container">
            <p className="ride-driver">Driver: {ride.driver}</p>
            <p className="ride-route">
                From: {ride.from_location} → To: {ride.to_location}
            </p>
            <p className="ride-coordinates">
                Start: ({ride.from_lat}, {ride.from_lon}) | Destination: ({ride.to_lat}, {ride.to_lon})
            </p>
            <p className="ride-date-time">
                Date: {formattedDate} | Time: {formattedTime}
            </p>
            <p className="ride-seats">
                Seats Available: {ride.seats_available} | Seats Taken: {ride.seats_taken}
            </p>
            {ride.luggage_capacity && <p className="ride-luggage">Luggage Capacity: {ride.luggage_capacity}</p>}
            {ride.additional_notes && <p className="ride-notes">Notes: {ride.additional_notes}</p>}
            <p className="ride-created">Posted on: {new Date(ride.created_at).toLocaleDateString("en-US")}</p>
            <button className="delete-button" onClick={() => onDelete(ride.id)}>
                Delete Ride
            </button>
        </div>
    );
}

export default Ride;
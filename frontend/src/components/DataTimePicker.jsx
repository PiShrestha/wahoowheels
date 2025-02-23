import React from "react";
import DatePicker from "react-datepicker";

function DateTimePicker({ selectedDateTime, onChangeDateTime }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">Date & Time</label>
      <div className="input-group" style={{ fontSize: "1.1rem" }}>
        {/* (Bootstrap Icons) */}
        <span className="input-group-text">
          <i className="bi bi-calendar3" />
        </span>
        <DatePicker
          selected={selectedDateTime}
          onChange={(date) => onChangeDateTime(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          className="form-control"
          popperPlacement="auto"
        />
      </div>
    </div>
  );
}

export default BigDateTimePicker;

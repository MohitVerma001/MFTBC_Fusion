import React from "react";
import "./FormFields.css";

const DateTimeField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  type = "datetime-local",
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className={`form-label ${required ? "required" : ""}`}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className={`form-control ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default DateTimeField;

import React from "react";
import "./FormFields.css";

const TextField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  type = "text",
  icon,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className={`form-label ${required ? "required" : ""}`}>
        {label}
      </label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          className={`form-control ${error ? "is-invalid" : ""} ${icon ? "has-icon" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default TextField;

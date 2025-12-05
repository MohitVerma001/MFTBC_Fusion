import React from "react";
import "./FormFields.css";

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  rows = 6,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className={`form-label ${required ? "required" : ""}`}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={`form-control ${error ? "is-invalid" : ""}`}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default TextArea;

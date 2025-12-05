import React from "react";
import "./FormFields.css";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder = "Select an option...",
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className={`form-label ${required ? "required" : ""}`}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`form-select ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default SelectField;

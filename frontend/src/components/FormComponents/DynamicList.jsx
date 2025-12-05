import React, { useState } from "react";
import "./FormFields.css";

const DynamicList = ({ label, items, onItemsChange, placeholder = "Enter item" }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = () => {
    if (inputValue.trim()) {
      onItemsChange([...items, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveItem = (index) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleAddItem}
        >
          Add Option
        </button>
      </div>
      {items.length > 0 && (
        <div className="dynamic-list">
          {items.map((item, index) => (
            <div key={index} className="dynamic-list-item">
              <span className="item-number">{index + 1}.</span>
              <span className="item-text">{item}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveItem(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicList;

import React, { useState } from "react";
import "./FormFields.css";

const TagInput = ({ label, tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Add a tag and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
      </div>
      {tags.length > 0 && (
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="badge tag-badge">
              {tag}
              <button
                type="button"
                className="tag-remove"
                onClick={() => handleRemoveTag(tag)}
                aria-label="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;

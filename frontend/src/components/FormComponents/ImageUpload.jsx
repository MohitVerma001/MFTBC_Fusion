import React from "react";
import "./FormFields.css";

const ImageUpload = ({ label, images = [], onImagesChange }) => {  // ⭐ SAFE DEFAULT

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            url: reader.result,
            file: file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((newImages) => {
      onImagesChange([...(images ?? []), ...newImages]);  // ⭐ merge safely
    });
  };

  const handleRemoveImage = (imageId) => {
    onImagesChange((images ?? []).filter((img) => img.id !== imageId));  // ⭐ safe
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <div className="file-upload-area">
        <input
          type="file"
          id="imageUpload"
          className="d-none"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        <label htmlFor="imageUpload" className="btn btn-outline-primary">
          <svg className="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Upload Images
        </label>
      </div>

      {(images?.length ?? 0) > 0 && (
        <div className="uploaded-files-grid mt-3">
          {(images ?? []).map((image) => (
            <div key={image.id} className="uploaded-image-card">
              <img src={image.url} alt={image.name} className="preview-image" />

              <div className="image-overlay">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveImage(image.id)}
                >
                  Remove
                </button>
              </div>

              <p className="image-name">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

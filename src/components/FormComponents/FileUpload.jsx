import React from "react";
import "./FormFields.css";

const FileUpload = ({ label, files = [], onFilesChange, accept = "*" }) => {

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);

    const newFiles = uploadedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
    }));

    onFilesChange([...(files ?? []), ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    onFilesChange((files ?? []).filter((file) => file.id !== fileId));
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <div className="file-upload-area">
        <input
          type="file"
          id="fileUpload"
          className="d-none"
          accept={accept}
          multiple
          onChange={handleFileUpload}
        />

        <label htmlFor="fileUpload" className="btn btn-outline-primary">
          <svg className="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3.5V12.5M3.5 8H12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Upload Files
        </label>
      </div>

      {(files?.length ?? 0) > 0 && (
        <div className="uploaded-files-list mt-3">
          {(files ?? []).map((file) => (
            <div key={file.id} className="uploaded-file-item">
              <div className="file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{file.size}</span>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-danger remove-btn"
                onClick={() => handleRemoveFile(file.id)}
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

export default FileUpload;

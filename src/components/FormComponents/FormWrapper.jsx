import React from "react";
import "./FormWrapper.css";

const FormWrapper = ({
  title,
  subtitle,
  children,
  onSubmit,
  onCancel = () => {},    // ⭐ default safe handler
  submitLabel = "Publish"
}) => {
  return (
    <div className="form-wrapper-page">
      <div className="container py-4">
        <div className="form-wrapper-container animate-fade-in">

          <div className="form-wrapper-header">
            <h1 className="form-wrapper-title animate-slide-up">{title}</h1>

            {subtitle && (
              <p className="form-wrapper-subtitle animate-slide-up delay-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* ⭐ ALWAYS render children safely */}
          <form onSubmit={onSubmit} className="form-wrapper-content">

            <div className="form-children">
              {children}
            </div>

            <div className="form-actions animate-slide-up delay-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={onCancel}   // ⭐ safe now
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary btn-lg btn-submit">
                {submitLabel}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default FormWrapper;

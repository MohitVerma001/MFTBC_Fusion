import React from "react";
import "./FormSection.css";

const FormSection = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`form-section card animate-slide-up ${className}`}>
      <div className="card-body">
        {title && (
          <h3 className="form-section-title">
            {icon && <span className="form-section-icon">{icon}</span>}
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default FormSection;

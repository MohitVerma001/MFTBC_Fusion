import React from "react";
import "./HeroSection.css";

const HeroSection = ({ title, subtitle, image }) => {
  return (
    <section
      className="hero-section"
      style={image ? { backgroundImage: `url(${image})` } : {}}
    >
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <div className="row">
          <div className="col-12">
            <h1 className="hero-title">{title}</h1>
            {subtitle && <p className="hero-subtitle">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

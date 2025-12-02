import React from "react";
import "./HeroSection.css";

const HeroSection = ({ title, subtitle }) => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <div className="row">
          <div className="col-12">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

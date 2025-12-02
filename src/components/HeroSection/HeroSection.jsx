import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        <div className="row">
          <div className="col-12">
            <h1 className="hero-title">
              Mitsubishi FUSO Truck and Bus Corporation
            </h1>
            <p className="hero-subtitle">
              Official corporate social network for FUSO employees
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

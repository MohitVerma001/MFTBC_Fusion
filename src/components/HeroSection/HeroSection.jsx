import React, { useState, useEffect } from "react";
import "./HeroSection.css";

const HeroSection = ({ title, subtitle, image }) => {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      if (!image) return;

      try {
        const response = await fetch(image);
        const text = await response.text();

        if (text.startsWith("http")) {
          setBgImage(text.trim());
        } else {
          setBgImage(image);
        }
      } catch (err) {
        console.error("Error loading background image:", err);
      }
    };

    loadImage();
  }, [image]);

  return (
    <section
      className="hero-section"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
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

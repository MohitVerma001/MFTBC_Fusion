import React, { useState, useEffect } from "react";

const ImageLoader = ({ src, alt = "", className = "", style = {}, onClick, ...rest }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!src) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const response = await fetch(src);
        const text = await response.text();

        if (text.startsWith("http")) {
          setImageSrc(text.trim());
        } else {
          setImageSrc(src);
        }
      } catch (err) {
        console.error("Error loading image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [src]);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#999" }}>Loading...</span>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div
        className={className}
        style={{
          ...style,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#999" }}>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
      onError={() => setError(true)}
      {...rest}
    />
  );
};

export default ImageLoader;

import React from "react";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./QuickAccess.css";

const QuickAccess = () => {
  const quickAccessData = [
    {
      icon: "/margin-wrap.svg",
      title: "Bus Schedule",
      description: "Find and connect with colleagues across the organization",
      bgColor: "blue-bg",
    },
    {
      icon: "/margin-wrap-6.svg",
      title: "Canteen Menu",
      description: "View events, meetings, and important company dates",
      bgColor: "green-bg",
    },
    {
      icon: "/margin-wrap-2.svg",
      title: "FUSO Map",
      description: "Navigate campus facilities and office locations",
      bgColor: "purple-bg",
    },
  ];

  return (
    <section className="quick-access-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="section-title">Quick Access</h2>
          </div>
        </div>

        <div className="row g-4">
          {quickAccessData.map((item, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className={`quick-access-card ${item.bgColor}`}>
                <ImageLoader src={item.icon} alt="" className="qa-icon" />
                <h3 className="qa-title">{item.title}</h3>
                <p className="qa-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;

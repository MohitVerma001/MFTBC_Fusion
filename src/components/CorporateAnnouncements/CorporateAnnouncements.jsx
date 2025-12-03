import React from "react";
import "./CorporateAnnouncements.css";

const CorporateAnnouncements = () => {
  const complianceCards = [
    { icon: "/margin-wrap-1.svg", title: "Compliance & Legal" },
    { icon: "/margin-wrap-4.svg", title: "Data Protection" },
    { icon: "/margin-wrap-3.svg", title: "Whistleblower Portal" },
    { icon: "/margin-wrap-5.svg", title: "Cybersecurity Incident" },
  ];

  return (
    <section className="corporate-announcements-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="section-title">Corporate Announcements</h2>
          </div>
        </div>

        {/* Featured Announcement Carousel */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="announcement-carousel">
              <div className="carousel-image-container">
                <img
                  src="/img-497.png"
                  alt="Corporate announcement"
                  className="carousel-image"
                />
                <div className="carousel-overlay"></div>

                {/* Carousel Content */}
                <div className="carousel-content">
                  <div className="carousel-badge">
                    <img src="/div-501.svg" alt="" className="badge-icon" />
                    <span>CEO Message</span>
                  </div>
                  <h3 className="carousel-title">
                    Vision 2026: Leading the Future of FUSO Commercial Vehicles
                  </h3>
                  <p className="carousel-date">March 15, 2024</p>
                </div>

                {/* Carousel Controls */}
                <button className="carousel-control-prev">
                  <img src="/button-564.svg" alt="Previous" />
                </button>
                <button className="carousel-control-next">
                  <img src="/button-567.svg" alt="Next" />
                </button>

                {/* Carousel Indicators */}
                <div className="carousel-indicators">
                  <span className="indicator active"></span>
                  <span className="indicator"></span>
                  <span className="indicator"></span>
                  <span className="indicator"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Cards */}
        <div className="row g-4">
          {complianceCards.map((card, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="compliance-card">
                <img src={card.icon} alt="" className="compliance-icon" />
                <h4 className="compliance-title">{card.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateAnnouncements;

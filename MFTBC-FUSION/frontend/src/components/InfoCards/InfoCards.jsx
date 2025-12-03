import React from "react";
import "./InfoCards.css";

const InfoCards = () => {
  const hrQuickLinks = [
    { icon: "/div-163.svg", label: "HR Policies" },
    { icon: "/div-170.svg", label: "Recruitment" },
    { icon: "/div-177.svg", label: "Compensation" },
    { icon: "/div-184.svg", label: "Time & Absence" },
  ];

  const itDigitalization = [
    {
      icon: "/div-196.svg",
      title: "Microsoft Teams",
      description: "Collaboration platform",
    },
    {
      icon: "/div-207.svg",
      title: "Power BI",
      description: "Business analytics",
    },
    {
      icon: "/div-218.svg",
      title: "eSignatures",
      description: "Digital signing",
    },
  ];

  const peopleConnect = [
    {
      initials: "SC",
      name: "Sarah Chen",
      role: "HR Director",
      followers: "12 mutual followers",
    },
    {
      initials: "MS",
      name: "Michael Schmidt",
      role: "IT Manager",
      followers: "8 mutual followers",
    },
    {
      initials: "YT",
      name: "Yuki Tanaka",
      role: "Operations Lead",
      followers: "15 mutual followers",
    },
  ];

  return (
    <section className="info-cards-section">
      <div className="container">
        <div className="row g-4">
          {/* HR Quick Links Card */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="info-card">
              <h3 className="info-card-title">HR Quick Links</h3>
              <div className="info-card-content">
                {hrQuickLinks.map((link, index) => (
                  <button key={index} className="link-item">
                    <img src={link.icon} alt="" className="link-icon" />
                    <span className="link-label">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* IT Digitalization Card */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="info-card">
              <h3 className="info-card-title">IT Digitalization</h3>
              <div className="info-card-content">
                {itDigitalization.map((item, index) => (
                  <button key={index} className="link-item">
                    <img src={item.icon} alt="" className="link-icon" />
                    <div className="link-text">
                      <div className="link-title">{item.title}</div>
                      <div className="link-description">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* People Connect Card */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="info-card">
              <h3 className="info-card-title">People Connect</h3>
              <div className="info-card-content">
                {peopleConnect.map((person, index) => (
                  <div key={index} className="person-item">
                    <div className="person-avatar">{person.initials}</div>
                    <div className="person-info">
                      <div className="person-name">{person.name}</div>
                      <div className="person-role">{person.role}</div>
                      <div className="person-followers">{person.followers}</div>
                    </div>
                    <button className="follow-btn">+ Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoCards;

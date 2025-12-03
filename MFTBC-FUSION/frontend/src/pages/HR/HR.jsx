import React from "react";
import "./HR.css";

const HR = () => {
  const hrCafeArticles = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: [
        { label: "#WorkLifeBalance", color: "#FFA500" },
        { label: "#Wellbeing", color: "#FFA500" }
      ],
      readTime: "5 min read",
      title: "Menu: Scheme",
      description: "The 'Scheme' menu will introduce various HR schemes that Mitsubishi Fuso employees should know by easy-to-understand...",
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
      tags: [
        { label: "#CareerGrowth", color: "#FFA500" },
        { label: "#Possibilities", color: "#FFA500" }
      ],
      readTime: "7 min read",
      title: "Menu: Career",
      description: "The 'Career' menu will regularly introduce the departments and jobs at MFTBC...",
    }
  ];

  const hrServices = [
    {
      id: 1,
      icon: "📅",
      iconColor: "#3B82F6",
      title: "Time & Absence",
      description: "Manage your leave requests, attendance tracking, and time-off policies"
    },
    {
      id: 2,
      icon: "👤",
      iconColor: "#10B981",
      title: "Onboarding",
      description: "Complete orientation process and access new employee resources"
    },
    {
      id: 3,
      icon: "💰",
      iconColor: "#8B5CF6",
      title: "Compensation & Allowances",
      description: "View salary details, benefits, and allowance information"
    },
    {
      id: 4,
      icon: "🏢",
      iconColor: "#F97316",
      title: "Facility Services",
      description: "Access office facilities, parking, and workspace services"
    },
    {
      id: 5,
      icon: "❤️",
      iconColor: "#EC4899",
      title: "Welfare & Benefits",
      description: "Learn about health insurance, wellness programs, and employee benefits"
    },
    {
      id: 6,
      icon: "🛡️",
      iconColor: "#EF4444",
      title: "Health & Safety",
      description: "Safety protocols, emergency procedures, and workplace guidelines"
    }
  ];

  const recruitmentStats = [
    {
      icon: "📂",
      value: "24",
      label: "Open Positions"
    },
    {
      icon: "📊",
      value: "8",
      label: "New Hires this Month"
    },
    {
      icon: "💼",
      value: "¥50,000",
      label: "Referral Bonus"
    }
  ];

  const helpfulLinks = [
    { icon: "⏰", title: "Time Management Smart Life", external: true },
    { icon: "🔍", title: "OS HRS Employee Self Service", external: true },
    { icon: "💼", title: "Internal Job Board", external: true },
    { icon: "✈️", title: "International Travel Booking", external: true },
    { icon: "🏠", title: "Domestic Travel Booking", external: true },
    { icon: "💵", title: "Travel Expense System", external: true }
  ];

  const helpDeskContacts = [
    {
      icon: "👤",
      title: "HR Service Desk",
      description: "Any further questions",
      email: "ask_hr_service.fuso@daimlertruck.com",
      phone: "044-330-7779"
    },
    {
      icon: "👥",
      title: "OS HRS Help Desk",
      description: "Payroll-related requests",
      email: "fuso@os.com",
      phone: "044-330-7770"
    }
  ];

  return (
    <div className="hr-page">
      {/* HR Café Section */}
      <section className="hr-cafe-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">HR Café — Connect. Learn. Grow.</h2>
            <p className="section-subtitle">Discover inspiring stories, updates, and HR initiatives.</p>
          </div>
          <div className="row g-4">
            {hrCafeArticles.map((article) => (
              <div key={article.id} className="col-12 col-md-6">
                <div className="hr-cafe-card">
                  <div className="cafe-card-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="cafe-card-content">
                    <div className="cafe-card-meta">
                      <div className="cafe-tags">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="cafe-tag"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <span className="cafe-read-time">{article.readTime}</span>
                    </div>
                    <h3 className="cafe-card-title">{article.title}</h3>
                    <p className="cafe-card-description">{article.description}</p>
                    <button className="cafe-read-more">Read More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HR Services Section */}
      <section className="hr-services-section">
        <div className="container">
          <h2 className="section-title">HR Services</h2>
          <div className="row g-4">
            {hrServices.map((service) => (
              <div key={service.id} className="col-12 col-md-6 col-lg-4">
                <div className="hr-service-card">
                  <div
                    className="service-icon"
                    style={{ backgroundColor: `${service.iconColor}15` }}
                  >
                    <span style={{ color: service.iconColor }}>{service.icon}</span>
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <button className="service-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment & Careers Section */}
      <section className="recruitment-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6">
              <h2 className="section-title">Recruitment & Careers</h2>
              <p className="section-subtitle mb-4">Explore new opportunities and internal job postings.</p>

              <div className="recruitment-tabs">
                <button className="recruitment-tab active">Internal Job Board</button>
                <button className="recruitment-tab">Current Openings</button>
                <button className="recruitment-tab">Refer a Candidate</button>
              </div>

              <div className="recruitment-stats">
                {recruitmentStats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="recruitment-image">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Team collaboration"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helpful Links Section */}
      <section className="helpful-links-section">
        <div className="container">
          <h2 className="section-title">Helpful Links</h2>
          <div className="row g-3">
            {helpfulLinks.map((link, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <a href="#" className="helpful-link-card">
                  <div className="link-icon">{link.icon}</div>
                  <span className="link-title">{link.title}</span>
                  {link.external && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="external-icon"
                    >
                      <path
                        d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Desk Section */}
      <section className="help-desk-section">
        <div className="container">
          <h2 className="section-title">Need Help from HR?</h2>
          <div className="row g-4 justify-content-center">
            {helpDeskContacts.map((contact, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-5">
                <div className="help-desk-card">
                  <div className="help-desk-icon">{contact.icon}</div>
                  <h3 className="help-desk-title">{contact.title}</h3>
                  <p className="help-desk-description">{contact.description}</p>
                  <div className="help-desk-contact">
                    <a href={`mailto:${contact.email}`} className="contact-email">
                      {contact.email}
                    </a>
                    <a href={`tel:${contact.phone}`} className="contact-phone">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HR;

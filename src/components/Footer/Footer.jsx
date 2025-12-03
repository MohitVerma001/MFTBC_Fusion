import React from "react";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./Footer.css";

const Footer = () => {
  const footerColumns = [
    {
      title: "Legal & Compliance",
      links: [
        { text: "Privacy" },
        { text: "Provider" },
        { text: "Posting content, rules on commenting and netiquette" },
      ],
    },
    {
      title: "More MFTBC Media",
      links: [{ text: "MFTBC Official Website" }],
    },
    {
      title: "Support & Help",
      links: [
        { text: "IT" },
        { text: "Digital Workplace" },
        { text: "Corporate User Helpdesk (CUHD)" },
      ],
    },
    {
      title: "Audit, Compliance & Legal",
      links: [
        { text: "Whistleblowing System SpeakUp" },
        { text: "Trusty Truck - Legal & Compliance Chatbot" },
        { text: "Daimler Truck Code of Conduct" },
        { text: "Report a personal data breach" },
        { text: "Report a Cyber Security Incident" },
      ],
    },
  ];

  return (
    <footer className="footer-container">
      <div className="container">
        {/* Footer Links */}
        <div className="row g-4 pb-5">
          {footerColumns.map((column, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <h3 className="footer-column-title">{column.title}</h3>
              <nav className="footer-links">
                {column.links.map((link, linkIndex) => (
                  <a key={linkIndex} href="#" className="footer-link">
                    {link.text}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Separator */}
        <div className="footer-separator"></div>

        {/* Footer Bottom */}
        <div className="row pt-4">
          <div className="col-12 col-lg-6 mb-3 mb-lg-0">
            <div className="d-flex align-items-center footer-brand">
              <ImageLoader className="footer-logo" alt="Company Logo" src="/div-6.svg" />
              <div className="footer-divider"></div>
              <span className="footer-company-name">
                Mitsubishi FUSO Truck and Bus Corporation
              </span>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="footer-copyright">
              <p>© 2025 Mitsubishi FUSO Truck and Bus Corporation. All rights reserved.</p>
              <p>Internal use only - Authorized employees only</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

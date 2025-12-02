import React from "react";
import "./Header.css";

const Header = () => {
  const languages = [
    { label: "English", active: true },
    { label: "日本語", active: false },
  ];

  return (
    <header className="header-container">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-auto">
            <img className="header-logo" alt="Logo" src="/div-6.svg" />
          </div>

          <div className="col d-flex justify-content-end align-items-center">
            <div className="d-flex align-items-center gap-3">
              <img className="header-icon" alt="Notification" src="/div-23.svg" />

              <div className="language-toggle">
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className={`language-option ${lang.active ? "active" : ""}`}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>

              <div className="d-flex align-items-center gap-2">
                <img className="header-icon" alt="Menu" src="/div-11.svg" />
                <img className="header-icon" alt="Button" src="/button-20.svg" />

                <div className="user-avatar">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

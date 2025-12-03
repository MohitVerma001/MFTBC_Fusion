import React, { useState } from "react";
import { Link } from "react-router-dom";
import CreatePanel from "../CreatePanel/CreatePanel";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./Header.css";

const Header = () => {
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);

  const languages = [
    { label: "English", active: true },
    { label: "日本語", active: false },
  ];

  const handleCreateClick = () => {
    setIsCreatePanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsCreatePanelOpen(false);
  };

  return (
    <>
      <header className="header-container">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-auto">
              <Link to="/">
                <ImageLoader className="header-logo" alt="Logo" src="/div-6.svg" />
              </Link>
            </div>

            <div className="col d-flex justify-content-end align-items-center">
              <div className="d-flex align-items-center gap-3">
                <ImageLoader className="header-icon" alt="Notification" src="/div-23.svg" />

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
                  <ImageLoader className="header-icon" alt="Menu" src="/div-11.svg" />
                  <ImageLoader
                    className="header-icon header-icon-clickable"
                    alt="Create"
                    src="/button-20.svg"
                    style={{ cursor: "pointer" }}
                    onClick={handleCreateClick}
                  />

                  <div className="user-avatar">
                    JD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreatePanel isOpen={isCreatePanelOpen} onClose={handleClosePanel} />
    </>
  );
};

export default Header;

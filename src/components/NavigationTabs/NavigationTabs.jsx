import React, { useState } from "react";
import "./NavigationTabs.css";

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState(null);

  const navigationItems = [
    { label: "News" },
    { label: "HR" },
    { label: "IT" },
    { label: "Cross Functions" },
    { label: "Activity" },
    { label: "Content" },
    { label: "People" },
    { label: "Spaces" },
    { label: "Calendar" },
    { label: "CEO Message" },
    { label: "More", hasDropdown: true },
  ];

  return (
    <nav className="navigation-tabs">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="nav-items-container">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.label)}
                  className={`nav-tab-item ${activeTab === item.label ? "active" : ""}`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="dropdown-icon"
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;

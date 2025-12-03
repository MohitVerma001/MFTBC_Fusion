import React from "react";
import { NavLink } from "react-router-dom";
import "./NavigationTabs.css";

const NavigationTabs = () => {
  const navigationItems = [
    { label: "News", path: "/news" },
    { label: "HR", path: "/hr" },
    { label: "IT", path: "/it" },
    { label: "Cross Functions", path: "/cross-functions" },
    { label: "Activity", path: "/activity" },
    { label: "Content", path: "/content" },
    { label: "People", path: "/people" },
    { label: "Spaces", path: "/spaces" },
    { label: "Calendar", path: "/calendar" },
    { label: "CEO Message", path: "/ceo-message" },
    { label: "More", path: "#", hasDropdown: true },
  ];

  return (
    <nav className="navigation-tabs">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="nav-items-container">
              {navigationItems.map((item, index) =>
                item.hasDropdown ? (
                  <button key={index} className="nav-tab-item">
                    <span>{item.label}</span>
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
                  </button>
                ) : (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-tab-item ${isActive ? "active" : ""}`
                    }
                  >
                    <span>{item.label}</span>
                  </NavLink>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationTabs;

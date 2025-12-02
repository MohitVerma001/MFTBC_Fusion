import React, { useEffect, useRef } from "react";
import "./CreatePanel.css";

const CreatePanel = ({ isOpen, onClose }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const menuItems = [
    {
      id: "blogs",
      label: "Create Blogs",
      icon: "📝",
      iconBg: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      id: "documents",
      label: "Create Documents",
      icon: "📄",
      iconBg: "#F0FDF4",
      iconColor: "#22C55E",
    },
    {
      id: "subspace",
      label: "Create SubSpace",
      icon: "🏢",
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
    },
    {
      id: "events",
      label: "Create Events",
      icon: "📅",
      iconBg: "#FCE7F3",
      iconColor: "#EC4899",
    },
    {
      id: "discussion",
      label: "Create Discussion",
      icon: "💬",
      iconBg: "#F3E8FF",
      iconColor: "#A855F7",
    },
    {
      id: "polls",
      label: "Create Polls",
      icon: "📊",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
    },
    {
      id: "videos",
      label: "Create Videos",
      icon: "🎥",
      iconBg: "#FEE2E2",
      iconColor: "#EF4444",
    },
  ];

  const handleItemClick = (item) => {
    console.log(`Clicked: ${item.label}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="create-panel-overlay" />
      <div className="create-panel" ref={panelRef}>
        <div className="create-panel-header">
          <h2 className="create-panel-title">Create New</h2>
          <button
            className="create-panel-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="create-panel-content">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="create-panel-item"
              onClick={() => handleItemClick(item)}
            >
              <div
                className="create-panel-icon"
                style={{
                  backgroundColor: item.iconBg,
                  color: item.iconColor,
                }}
              >
                {item.icon}
              </div>
              <span className="create-panel-label">{item.label}</span>
              <svg
                className="create-panel-arrow"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7 4L13 10L7 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CreatePanel;

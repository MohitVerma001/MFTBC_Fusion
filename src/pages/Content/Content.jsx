import React, { useState } from "react";
import "./Content.css";

const Content = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const contentTabs = [
    { id: "all", label: "All Content", count: 20 },
    { id: "blog", label: "Blog Posts", count: 8 },
    { id: "documents", label: "Documents", count: 8 },
    { id: "discussions", label: "Discussions", count: 0 },
    { id: "polls", label: "Polls", count: 1 },
    { id: "videos", label: "Videos", count: 1 },
    { id: "events", label: "Events", count: 2 }
  ];

  const contentItems = [
    {
      id: 1,
      type: "document",
      icon: "📄",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
      title: "HR Learning & Development: Training",
      description: "Discover our comprehensive learning initiatives designed to enhance employee skills and career growth",
      tags: [
        { label: "HR", color: "#E3F2FD" },
        { label: "Training", color: "#E3F2FD" }
      ],
      author: {
        name: "Sarah Chen",
        avatar: "SC",
        avatarBg: "#2196F3"
      },
      likes: 45,
      views: 234,
      comments: 12
    },
    {
      id: 2,
      type: "document",
      icon: "📋",
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
      title: "Company-Wide Safety Guidelines and Protocols",
      description: "Updated safety procedures and emergency response protocols for all Daimler Truck Asia facilities. Mandatory",
      tags: [
        { label: "Safety", color: "#E8F5E9" },
        { label: "Compliance", color: "#E8F5E9" }
      ],
      author: {
        name: "Robert Schmidt",
        avatar: "RS",
        avatarBg: "#4CAF50"
      },
      likes: 89,
      views: 567,
      comments: 23
    },
    {
      id: 3,
      type: "event",
      icon: "📅",
      iconBg: "#FCE4EC",
      iconColor: "#E91E63",
      title: "Japan Mobility Show 2025 Preview: Driving the Future",
      description: "Watch highlights from our participation at Japan Mobility Show 2025, featuring our latest electric truck innovations and",
      tags: [
        { label: "Events", color: "#FCE4EC" },
        { label: "Innovation", color: "#FCE4EC" }
      ],
      author: {
        name: "Yuki Tanaka",
        avatar: "YT",
        avatarBg: "#E91E63"
      },
      likes: 156,
      views: 892,
      comments: 34
    },
    {
      id: 4,
      type: "document",
      icon: "📄",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
      title: "IT Security Best Practices: Protecting Company Data",
      description: "Essential cybersecurity guidelines for all employees. Learn how to identify phishing attempts, secure your devices,",
      tags: [
        { label: "IT", color: "#E3F2FD" },
        { label: "Security", color: "#E3F2FD" }
      ],
      author: {
        name: "David Park",
        avatar: "DP",
        avatarBg: "#2196F3"
      },
      likes: 67,
      views: 445,
      comments: 18
    },
    {
      id: 5,
      type: "document",
      icon: "📄",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
      title: "Sustainability Initiative: Our Journey to Carbon",
      description: "Explore our comprehensive sustainability roadmap and the innovative steps we are taking to",
      tags: [
        { label: "Sustainability", color: "#E3F2FD" },
        { label: "Environment", color: "#E3F2FD" }
      ],
      author: {
        name: "Emma Wilson",
        avatar: "EW",
        avatarBg: "#2196F3"
      },
      likes: 123,
      views: 678,
      comments: 29
    },
    {
      id: 6,
      type: "event",
      icon: "📅",
      iconBg: "#FCE4EC",
      iconColor: "#E91E63",
      title: "Annual Town Hall Meeting 2024: Leadership Vision &",
      description: "Join our CEO and executive leadership team for the annual town hall meeting. Discuss company performance, future",
      tags: [
        { label: "Events", color: "#FCE4EC" },
        { label: "Leadership", color: "#FCE4EC" }
      ],
      author: {
        name: "Robert Johnson",
        avatar: "RJ",
        avatarBg: "#E91E63"
      },
      likes: 234,
      views: 1245,
      comments: 56
    },
    {
      id: 7,
      type: "document",
      icon: "📋",
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
      title: "Employee Benefits Guide: Health, Wellness &",
      description: "Comprehensive guide to all employee benefits including health insurance, retirement plans, wellness programs,",
      tags: [
        { label: "HR", color: "#E8F5E9" },
        { label: "Benefits", color: "#E8F5E9" }
      ],
      author: {
        name: "Lisa Anderson",
        avatar: "LA",
        avatarBg: "#4CAF50"
      },
      likes: 98,
      views: 534,
      comments: 21
    },
    {
      id: 8,
      type: "document",
      icon: "📄",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
      title: "Innovation Spotlight: AI-Powered Predictive",
      description: "Learn how our engineering team is using artificial intelligence and machine learning to revolutionize",
      tags: [
        { label: "Innovation", color: "#E3F2FD" },
        { label: "AI", color: "#E3F2FD" }
      ],
      author: {
        name: "James Lee",
        avatar: "JL",
        avatarBg: "#2196F3"
      },
      likes: 187,
      views: 823,
      comments: 42
    },
    {
      id: 9,
      type: "document",
      icon: "📋",
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
      title: "Cross-Functional Collaboration Framework:",
      description: "Guidelines for effective cross-departmental collaboration, communication protocols, and project",
      tags: [
        { label: "Collaboration", color: "#E8F5E9" },
        { label: "Process", color: "#E8F5E9" }
      ],
      author: {
        name: "Maria Garcia",
        avatar: "MG",
        avatarBg: "#4CAF50"
      },
      likes: 76,
      views: 412,
      comments: 15
    },
    {
      id: 10,
      type: "document",
      icon: "📋",
      iconBg: "#FFF3E0",
      iconColor: "#FF9800",
      title: "Employee Engagement Survey: Share Your",
      description: "Help us improve workplace culture and employee experience. Your feedback is valuable for shaping our",
      tags: [
        { label: "HR", color: "#FFF3E0" },
        { label: "Engagement", color: "#FFF3E0" }
      ],
      author: {
        name: "HR Department",
        avatar: "HR",
        avatarBg: "#FF9800"
      },
      likes: 145,
      views: 967,
      comments: 8
    },
    {
      id: 11,
      type: "document",
      icon: "📄",
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
      title: "Diversity & Inclusion: Building a More Inclusive",
      description: "Our commitment to fostering diversity, equity, and inclusion throughout the organization. Learn about our D&I",
      tags: [
        { label: "Diversity", color: "#E3F2FD" },
        { label: "Inclusion", color: "#E3F2FD" }
      ],
      author: {
        name: "Patricia Brown",
        avatar: "PB",
        avatarBg: "#2196F3"
      },
      likes: 112,
      views: 589,
      comments: 27
    },
    {
      id: 12,
      type: "document",
      icon: "📋",
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
      title: "Remote Work Policy: Guidelines and Best",
      description: "Updated remote work policies, equipment guidelines, communication expectations, and tips for maintaining",
      tags: [
        { label: "HR", color: "#E8F5E9" },
        { label: "Remote Work", color: "#E8F5E9" }
      ],
      author: {
        name: "Thomas Miller",
        avatar: "TM",
        avatarBg: "#4CAF50"
      },
      likes: 134,
      views: 723,
      comments: 31
    }
  ];

  return (
    <div className="content-page">
      <div className="container">
        <h1 className="content-page-title">Content</h1>

        <div className="content-tabs-container">
          <div className="content-tabs">
            {contentTabs.map((tab) => (
              <button
                key={tab.id}
                className={`content-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="1" y="12" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        <div className="content-filters">
          <div className="filter-group">
            <label className="filter-label">Filter by Action</label>
            <select className="filter-select">
              <option>None</option>
              <option>My Content</option>
              <option>Bookmarked</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Shared Content</label>
            <div className="checkbox-container">
              <input type="checkbox" id="sharedWithMe" />
              <label htmlFor="sharedWithMe">Shared with me only</label>
            </div>
          </div>

          <div className="filter-group flex-grow">
            <label className="filter-label">Search</label>
            <div className="search-input-container">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="search-icon">
                <circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Type to filter by text"
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Filter by Tag</label>
            <select className="filter-select">
              <option>Select tags</option>
              <option>HR</option>
              <option>IT</option>
              <option>Events</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select className="filter-select">
              <option>Latest Activity</option>
              <option>Most Popular</option>
              <option>Most Recent</option>
            </select>
          </div>
        </div>

        <div className="content-count">Showing 20 items</div>

        <div className="content-grid">
          {contentItems.map((item) => (
            <div key={item.id} className="content-card">
              <div className="card-header">
                <div
                  className="card-icon"
                  style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                >
                  {item.icon}
                </div>
                <button className="card-menu-btn" aria-label="More options">
                  <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                    <circle cx="2" cy="2" r="1.5" fill="#9CA3AF" />
                    <circle cx="2" cy="8" r="1.5" fill="#9CA3AF" />
                    <circle cx="2" cy="14" r="1.5" fill="#9CA3AF" />
                  </svg>
                </button>
              </div>

              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>

              <div className="card-tags">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="card-tag"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.label}
                  </span>
                ))}
                <span className="tag-count">+1</span>
              </div>

              <div className="card-footer">
                <div className="card-author">
                  <div
                    className="author-avatar"
                    style={{ backgroundColor: item.author.avatarBg }}
                  >
                    {item.author.avatar}
                  </div>
                  <div className="author-info">
                    <div className="author-label">Last modified by</div>
                    <div className="author-name">{item.author.name}</div>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 14C8 14 2 10 2 5.5C2 3.5 3.5 2 5.5 2C6.5 2 7.5 2.5 8 3.5C8.5 2.5 9.5 2 10.5 2C12.5 2 14 3.5 14 5.5C14 10 8 14 8 14Z"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <span>{item.likes}</span>
                  </div>
                  <div className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                      <circle cx="8" cy="8" r="1.5" fill="#9CA3AF" />
                    </svg>
                    <span>{item.views}</span>
                  </div>
                  <div className="stat-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 5.5C2 4.67157 2.67157 4 3.5 4H12.5C13.3284 4 14 4.67157 14 5.5V10.5C14 11.3284 13.3284 12 12.5 12H3.5C2.67157 12 2 11.3284 2 10.5V5.5Z"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M2 6L8 9L14 6"
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{item.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M6 2L2 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="pagination-page active">1</button>
          <button className="pagination-page">2</button>
          <button className="pagination-btn">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M2 2L6 6L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Content;

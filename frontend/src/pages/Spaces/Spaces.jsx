import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Spaces.css";

const Spaces = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("Latest Activity");
  const [activeTab, setActiveTab] = useState("All Places");
  const [viewMode, setViewMode] = useState("grid");
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const demoSpaces = [
    {
      id: 1,
      name: "Mitsubishi FUSO Truck and Bus Corporation",
      description: "Based in Kawasaki, Japan, Mitsubishi Fuso Truck and Bus",
      image: "/div-34.png",
      followers: 542,
      subSpaces: 4,
      followed: false
    },
    {
      id: 2,
      name: "Mitsubishi FUSO Truck and Bus Corporation",
      description: "Mitsubishi FUSO Truck and Bus Corporation (MFTBC), a 100% subsidiary",
      image: "/div-34.png",
      followers: 315,
      subSpaces: 2,
      followed: false
    },
    {
      id: 3,
      name: "Mitsubishi FUSO Truck and Bus Corporation",
      description: "Welcome to the MFTBC ESG, your hub for all things Environmental, Social",
      image: "/div-34.png",
      followers: 47,
      subSpaces: 0,
      followed: false
    }
  ];

  useEffect(() => {
    setSpaces(demoSpaces);
  }, []);

  const handleFollowToggle = (spaceId) => {
    setSpaces(spaces.map(space =>
      space.id === spaceId
        ? { ...space, followed: !space.followed, followers: space.followed ? space.followers - 1 : space.followers + 1 }
        : space
    ));
  };

  const handleShare = (space) => {
    if (navigator.share) {
      navigator.share({
        title: space.name,
        text: space.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="spaces-page">
      <section className="spaces-hero-section">
        <div className="spaces-hero-overlay"></div>
        <div className="spaces-hero-content">
          <h1 className="spaces-hero-title">Spaces</h1>
          <p className="spaces-hero-subtitle">
            Find and follow spaces that matter to your work and interests.
          </p>
        </div>
      </section>

      <section className="spaces-navigation-section">
        <div className="container">
          <div className="spaces-tabs">
            {["News", "HR", "IT", "Cross Functions", "Activity", "Content", "People", "Spaces", "Calendar", "CEO Message", "More"].map((tab) => (
              <button
                key={tab}
                className={`spaces-tab ${tab === "Spaces" ? 'active' : ''}`}
                onClick={() => tab === "News" ? navigate("/news") : tab === "HR" ? navigate("/hr") : null}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="spaces-filters-section">
        <div className="container">
          <div className="spaces-filters-row">
            <div className="spaces-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Type to filter by text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="spaces-search-input"
              />
            </div>

            <div className="spaces-filter-dropdown">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <select className="spaces-select">
                <option>Select tags</option>
                <option>Manufacturing</option>
                <option>HR</option>
                <option>IT</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            <div className="spaces-filter-dropdown">
              <select className="spaces-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Latest Activity</option>
                <option>Most Followers</option>
                <option>Alphabetical</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="spaces-content-section">
        <div className="container">
          <div className="spaces-toolbar">
            <div className="spaces-type-tabs">
              <button
                className={`spaces-type-tab ${activeTab === "All Places" ? 'active' : ''}`}
                onClick={() => setActiveTab("All Places")}
              >
                All Places
              </button>
              <button
                className={`spaces-type-tab ${activeTab === "Spaces" ? 'active' : ''}`}
                onClick={() => setActiveTab("Spaces")}
              >
                Spaces
              </button>
              <button
                className={`spaces-type-tab ${activeTab === "Projects" ? 'active' : ''}`}
                onClick={() => setActiveTab("Projects")}
              >
                Projects
              </button>
            </div>

            <div className="spaces-view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === "grid" ? 'active' : ''}`}
                onClick={() => setViewMode("grid")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </button>
              <button
                className={`view-toggle-btn ${viewMode === "list" ? 'active' : ''}`}
                onClick={() => setViewMode("list")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className={`spaces-grid ${viewMode === "list" ? 'list-view' : ''}`}>
            {spaces.map((space) => (
              <div key={space.id} className="space-card">
                <div className="space-card-image">
                  <img src={space.image} alt={space.name} />
                  <button
                    className={`space-follow-btn ${space.followed ? 'following' : ''}`}
                    onClick={() => handleFollowToggle(space.id)}
                  >
                    {space.followed ? 'Following' : '+ Follow'}
                  </button>
                </div>
                <div className="space-card-content">
                  <h3 className="space-card-title">{space.name}</h3>
                  <p className="space-card-description">{space.description}</p>
                  <div className="space-card-meta">
                    <span className="space-meta-item">{space.followers} Followers</span>
                    {space.subSpaces > 0 && (
                      <>
                        <span className="space-meta-divider">|</span>
                        <span className="space-meta-item">{space.subSpaces} Sub-spaces</span>
                      </>
                    )}
                  </div>
                  <button className="space-share-btn" onClick={() => handleShare(space)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spaces;

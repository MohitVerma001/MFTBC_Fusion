import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection/HeroSection";
import NavigationTabs from "../../components/NavigationTabs/NavigationTabs";
import { spacesApi } from "../../services";
import "./Spaces.css";

const Spaces = () => {
  const navigate = useNavigate();
  const [rootSpaces, setRootSpaces] = useState([]);
  const [childSpaces, setChildSpaces] = useState({});
  const [expandedSpaces, setExpandedSpaces] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      setLoading(true);

      const rootResult = await spacesApi.getSubspaces('?is_root_space=true');
      if (rootResult.success) {
        const roots = rootResult.data || [];
        setRootSpaces(roots);

        const childData = {};
        for (const root of roots) {
          const childResult = await spacesApi.getSubspaces(`?parent_space_id=${root.id}`);
          if (childResult.success) {
            childData[root.id] = childResult.data || [];
          }
        }
        setChildSpaces(childData);
      }
    } catch (error) {
      console.error("Error loading spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpaceExpand = (spaceId) => {
    const newExpanded = new Set(expandedSpaces);
    if (newExpanded.has(spaceId)) {
      newExpanded.delete(spaceId);
    } else {
      newExpanded.add(spaceId);
    }
    setExpandedSpaces(newExpanded);
  };

  const handleSpaceClick = (space) => {
    navigate(`/space/${space.id}`);
  };

  const handleCreateSpace = () => {
    navigate("/create/space");
  };

  const filterSpaces = (spaces) => {
    if (!searchTerm) return spaces;
    return spaces.filter(space =>
      space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderNavigationBadges = (navigationItems) => {
    if (!navigationItems || navigationItems.length === 0) return null;

    const icons = {
      "News": "📰",
      "HR": "👥",
      "Activity": "⚡",
      "Content": "📚",
      "IT": "💻",
      "People": "👤",
      "Spaces": "🌐",
      "Calendar": "📅",
      "CEO Message": "💼"
    };

    return (
      <div className="nav-badges">
        {navigationItems.slice(0, 5).map((item, idx) => (
          <span key={idx} className="nav-badge" title={item}>
            {icons[item] || "📌"}
          </span>
        ))}
        {navigationItems.length > 5 && (
          <span className="nav-badge more">+{navigationItems.length - 5}</span>
        )}
      </div>
    );
  };

  const renderSpaceCard = (space, isChild = false) => {
    const hasChildren = childSpaces[space.id] && childSpaces[space.id].length > 0;
    const isExpanded = expandedSpaces.has(space.id);

    return (
      <div key={space.id} className={`space-card-wrapper ${isChild ? 'child-space' : 'root-space'}`}>
        <div className="space-card">
          <div className="space-card-main" onClick={() => handleSpaceClick(space)}>
            {space.image_url && (
              <div className="space-card-image">
                <img src={space.image_url} alt={space.name} />
              </div>
            )}
            <div className="space-card-content">
              <div className="space-card-header">
                <h3 className="space-card-title">
                  {!isChild && <span className="root-badge">🌐</span>}
                  {space.name}
                </h3>
                {space.is_root_space && (
                  <span className="space-badge root">Root Space</span>
                )}
              </div>
              <p className="space-card-description">
                {space.description?.replace(/<[^>]*>/g, '').substring(0, 120)}
                {space.description?.length > 120 && "..."}
              </p>
              {renderNavigationBadges(space.navigation_items)}
              <div className="space-card-meta">
                <span className="meta-tag">{space.language || "English"}</span>
                <span className={`meta-tag ${space.visibility}`}>
                  {space.visibility === "public" ? "🌐 Public" : "🔒 Restricted"}
                </span>
              </div>
            </div>
          </div>

          {hasChildren && !isChild && (
            <button
              className={`expand-toggle ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSpaceExpand(space.id);
              }}
            >
              {isExpanded ? '▼' : '▶'} {childSpaces[space.id].length} sub-space{childSpaces[space.id].length !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="child-spaces-container">
            {filterSpaces(childSpaces[space.id]).map(childSpace =>
              renderSpaceCard(childSpace, true)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <HeroSection
        title="Spaces"
        subtitle="Explore collaborative workspaces"
        image="/div-34.png"
      />
      <NavigationTabs />

      <div className="spaces-page-container">
        <div className="page-container">
          <div className="spaces-page-header">
            <div className="search-section-new">
              <input
                type="text"
                className="search-input-new"
                placeholder="Search spaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-create-new" onClick={handleCreateSpace}>
              <span className="btn-icon">✨</span>
              Create New Space
            </button>
          </div>

          {loading ? (
            <div className="loading-container-new">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading spaces...</p>
            </div>
          ) : filterSpaces(rootSpaces).length === 0 ? (
            <div className="empty-state-new">
              <div className="empty-icon-new">🌐</div>
              <h3>No Spaces Found</h3>
              <p>
                {searchTerm
                  ? "No spaces match your search criteria"
                  : "No spaces available yet"}
              </p>
              {!searchTerm && (
                <button className="btn-create-new" onClick={handleCreateSpace}>
                  Create First Space
                </button>
              )}
            </div>
          ) : (
            <div className="spaces-hierarchy">
              {filterSpaces(rootSpaces).map(space => renderSpaceCard(space))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Spaces;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { spacesApi } from "../../services";
import "./MySpacesSection.css";

const MySpacesSection = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = "00000000-0000-0000-0000-000000000001";

  useEffect(() => {
    loadMySpaces();
  }, []);

  const loadMySpaces = async () => {
    try {
      setLoading(true);
      const result = await spacesApi.getSubspaces(`?created_by=${currentUserId}&limit=3`);
      if (result.success) {
        setSpaces(result.data || []);
      }
    } catch (error) {
      console.error("Error loading spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceClick = (spaceId) => {
    navigate(`/space/${spaceId}`);
  };

  const handleViewAll = () => {
    navigate("/my-spaces");
  };

  if (loading) {
    return (
      <section className="my-spaces-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">My Spaces</h2>
          </div>
          <div className="loading-state">
            <div className="spinner-border text-danger" role="status"></div>
            <p>Loading your spaces...</p>
          </div>
        </div>
      </section>
    );
  }

  if (spaces.length === 0) {
    return null;
  }

  return (
    <section className="my-spaces-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">My Spaces</h2>
          <button className="btn-view-all" onClick={handleViewAll}>
            View All →
          </button>
        </div>

        <div className="spaces-grid">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="space-card"
              onClick={() => handleSpaceClick(space.id)}
            >
              {space.image_url && (
                <div className="space-image">
                  <img src={space.image_url} alt={space.name} />
                </div>
              )}
              <div className="space-content">
                <div className="space-header-row">
                  <h3 className="space-title">{space.name}</h3>
                  {space.visibility === "restricted" && (
                    <span className="badge badge-restricted">🔒</span>
                  )}
                  {space.visibility === "public" && (
                    <span className="badge badge-public">🌐</span>
                  )}
                </div>

                <p className="space-description">
                  {space.description?.replace(/<[^>]*>/g, '').substring(0, 100)}
                  {space.description?.length > 100 && "..."}
                </p>

                <div className="space-meta">
                  <span className="meta-tag">{space.language === "en" ? "English" : space.language === "ja" ? "Japanese" : space.language}</span>
                  <span className={`meta-tag status ${space.is_published ? "published" : "draft"}`}>
                    {space.is_published ? "✓ Published" : "📝 Draft"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MySpacesSection;

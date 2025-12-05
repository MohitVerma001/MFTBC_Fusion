import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection/HeroSection";
import NavigationTabs from "../../components/NavigationTabs/NavigationTabs";
import { spacesApi } from "../../services";
import "./MySpaces.css";

const MySpaces = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUserId = "00000000-0000-0000-0000-000000000001";

  useEffect(() => {
    loadMySpaces();
  }, []);

  const loadMySpaces = async () => {
    try {
      setLoading(true);
      const result = await spacesApi.getSubspaces(`?created_by=${currentUserId}`);
      if (result.success) {
        setSpaces(result.data || []);
      }
    } catch (error) {
      console.error("Error loading spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = () => {
    navigate("/create/space");
  };

  const handleEditSpace = (spaceId) => {
    navigate(`/create/space/${spaceId}`);
  };

  const handleDeleteSpace = async (spaceId, spaceName) => {
    if (window.confirm(`Are you sure you want to delete "${spaceName}"?`)) {
      try {
        const result = await spacesApi.delete(spaceId);
        if (result.success) {
          alert("Space deleted successfully");
          loadMySpaces();
        } else {
          alert("Failed to delete space");
        }
      } catch (error) {
        console.error("Error deleting space:", error);
        alert("An error occurred while deleting the space");
      }
    }
  };

  const filteredSpaces = spaces.filter(space =>
    space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <HeroSection
        title="My Spaces"
        subtitle="Manage your collaborative spaces"
        image="/div-34.png"
      />
      <NavigationTabs />

      <div className="my-spaces-container">
        <div className="page-container">
          <div className="spaces-header">
            <div className="search-section">
              <input
                type="text"
                className="search-input"
                placeholder="Search spaces by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCreateSpace}>
              <span className="icon">➕</span>
              Create New Space
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading your spaces...</p>
            </div>
          ) : filteredSpaces.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No Spaces Found</h3>
              <p>
                {searchTerm
                  ? "No spaces match your search criteria"
                  : "You haven't created any spaces yet"}
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={handleCreateSpace}>
                  Create Your First Space
                </button>
              )}
            </div>
          ) : (
            <div className="spaces-grid">
              {filteredSpaces.map((space) => (
                <div key={space.id} className="space-card">
                  {space.image_url && (
                    <div className="space-image">
                      <img src={space.image_url} alt={space.name} />
                    </div>
                  )}
                  <div className="space-content">
                    <div className="space-header-row">
                      <h3 className="space-title">{space.name}</h3>
                      {space.visibility === "restricted" && (
                        <span className="badge badge-restricted">🔒 Restricted</span>
                      )}
                      {space.visibility === "public" && (
                        <span className="badge badge-public">🌐 Public</span>
                      )}
                    </div>

                    <p className="space-description">
                      {space.description?.replace(/<[^>]*>/g, '').substring(0, 150)}
                      {space.description?.length > 150 && "..."}
                    </p>

                    <div className="space-meta">
                      <span className="meta-item">
                        <strong>Language:</strong> {space.language || "English"}
                      </span>
                      {space.scheduled_at && (
                        <span className="meta-item">
                          <strong>Scheduled:</strong> {new Date(space.scheduled_at).toLocaleDateString()}
                        </span>
                      )}
                      <span className={`meta-item status ${space.is_published ? "published" : "draft"}`}>
                        {space.is_published ? "✓ Published" : "📝 Draft"}
                      </span>
                    </div>

                    <div className="space-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditSpace(space.id)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteSpace(space.id, space.name)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="spaces-summary">
            <p>
              Showing <strong>{filteredSpaces.length}</strong> of <strong>{spaces.length}</strong> spaces
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MySpaces;

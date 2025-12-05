import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection/HeroSection";
import NavigationTabs from "../../components/NavigationTabs/NavigationTabs";
import { blogsApi } from "../../services";
import "./MyContent.css";

const MyContent = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    tags: "",
    publishTo: ""
  });

  const currentUserId = "00000000-0000-0000-0000-000000000001";

  useEffect(() => {
    loadMyBlogs();
  }, [filters]);

  const loadMyBlogs = async () => {
    try {
      setLoading(true);
      let query = `?authorId=${currentUserId}`;

      if (filters.search) {
        query += `&search=${encodeURIComponent(filters.search)}`;
      }

      if (filters.tags) {
        query += `&tags=${encodeURIComponent(filters.tags)}`;
      }

      if (filters.publishTo) {
        query += `&publishTo=${encodeURIComponent(filters.publishTo)}`;
      }

      const result = await blogsApi.getBlogs(query);
      if (result.success) {
        setBlogs(result.data?.items || []);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      tags: "",
      publishTo: ""
    });
  };

  const handleCreateBlog = () => {
    navigate("/create/blog");
  };

  const handleEditBlog = (blogId) => {
    navigate(`/create/blog/${blogId}`);
  };

  const handleViewBlog = (blogId) => {
    navigate(`/news/${blogId}`);
  };

  const getPublishToLabel = (publishTo) => {
    const labels = {
      "News": "📰 News",
      "HR": "👥 HR",
      "IT": "💻 IT"
    };
    return labels[publishTo] || publishTo;
  };

  const getStatusBadge = (blog) => {
    if (blog.hidden_post) {
      return <span className="badge badge-hidden">👁️‍🗨️ Hidden</span>;
    }
    if (blog.status === "draft") {
      return <span className="badge badge-draft">📝 Draft</span>;
    }
    if (blog.scheduled_at && new Date(blog.scheduled_at) > new Date()) {
      return <span className="badge badge-scheduled">⏰ Scheduled</span>;
    }
    return <span className="badge badge-published">✓ Published</span>;
  };

  return (
    <>
      <Header />
      <HeroSection
        title="My Content"
        subtitle="Manage your blogs and articles"
        image="/div-34.png"
      />
      <NavigationTabs />

      <div className="my-content-container">
        <div className="page-container">
          <div className="content-header">
            <button className="btn btn-primary" onClick={handleCreateBlog}>
              <span className="icon">✍️</span>
              Create New Blog
            </button>
          </div>

          <div className="filters-section card">
            <h3 className="filters-title">Filters</h3>
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="search" className="filter-label">
                  Search by Name or Text
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  className="filter-input"
                  placeholder="Search blogs..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="tags" className="filter-label">
                  Filter by Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  className="filter-input"
                  placeholder="Enter tag name..."
                  value={filters.tags}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="publishTo" className="filter-label">
                  Publish To
                </label>
                <select
                  id="publishTo"
                  name="publishTo"
                  className="filter-select"
                  value={filters.publishTo}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="News">News</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                </select>
              </div>

              <div className="filter-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading your content...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No Blogs Found</h3>
              <p>
                {Object.values(filters).some(v => v)
                  ? "No blogs match your filter criteria"
                  : "You haven't created any blogs yet"}
              </p>
              {!Object.values(filters).some(v => v) && (
                <button className="btn btn-primary" onClick={handleCreateBlog}>
                  Create Your First Blog
                </button>
              )}
            </div>
          ) : (
            <div className="blogs-grid">
              {blogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-content">
                    <div className="blog-header-row">
                      <h3 className="blog-title">{blog.title}</h3>
                      {getStatusBadge(blog)}
                    </div>

                    {blog.publish_to && (
                      <div className="blog-category">
                        {getPublishToLabel(blog.publish_to)}
                      </div>
                    )}

                    <p className="blog-excerpt">
                      {blog.content?.replace(/<[^>]*>/g, '').substring(0, 200)}
                      {blog.content?.length > 200 && "..."}
                    </p>

                    <div className="blog-meta">
                      <span className="meta-item">
                        📅 {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      {blog.scheduled_at && (
                        <span className="meta-item">
                          ⏰ Scheduled: {new Date(blog.scheduled_at).toLocaleDateString()}
                        </span>
                      )}
                      {blog.restricted_comments && (
                        <span className="meta-item">💬 Comments Off</span>
                      )}
                    </div>

                    <div className="blog-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewBlog(blog.id)}
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditBlog(blog.id)}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="content-summary">
            <p>
              Showing <strong>{blogs.length}</strong> blog{blogs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyContent;

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LikeButton from "../../components/LikeButton/LikeButton";
import "./News.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NAVIGATION_TABS = [
  "News", "HR", "IT", "Cross Functions", "Activity",
  "Content", "People", "Spaces", "Calendar", "CEO Message", "More"
];

const CATEGORY_COLORS = {
  Achievement: "#E60000",
  Manufacturing: "#E60000",
  Operations: "#E60000",
  HR: "#E60000",
  Sustainability: "#00A859",
  Leadership: "#1E3A8A",
  Expansion: "#DC2626",
  IT: "#DC2626"
};

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedAuthor, setSelectedAuthor] = useState(searchParams.get('authorId') || '');
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');
  const [activeTab, setActiveTab] = useState('News');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, [searchParams]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        publishTo: 'News',
        jiveFormat: 'true',
        page: page,
        limit: 6,
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedAuthor) params.append('authorId', selectedAuthor);

      const res = await fetch(`${API_URL}/blogs?${params.toString()}`);
      const data = await res.json();

      setArticles(data.items || []);
      setPagination({
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        totalItems: data.totalItems,
      });
    } catch (err) {
      console.error("Error fetching news:", err);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURLParams({ search: searchQuery, page: 1 });
  };

  const updateURLParams = (newParams) => {
    const params = new URLSearchParams();
    if (newParams.search) params.set('search', newParams.search);
    if (newParams.authorId) params.set('authorId', newParams.authorId);
    if (newParams.time) params.set('time', newParams.time);
    if (newParams.page > 1) params.set('page', newParams.page);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateURLParams({ search: searchQuery, authorId: selectedAuthor, time: selectedTime, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return "News";
    const firstTag = tags[0];
    return firstTag;
  };

  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || "#E60000";
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} hour${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) return <div className="loading-text">Loading News...</div>;

  return (
    <div className="news-page-redesign">
      <section className="news-hero-section">
        <div className="news-hero-overlay"></div>
        <div className="news-hero-content">
          <h1 className="news-hero-title">MFTBC News</h1>
          <p className="news-hero-subtitle">
            Stay informed with official updates, internal announcements,<br />
            achievements, and cross-location highlights from FUSO.
          </p>
        </div>
      </section>

      <section className="news-navigation-section">
        <div className="container">
          <div className="news-tabs">
            {NAVIGATION_TABS.map((tab) => (
              <button
                key={tab}
                className={`news-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="news-search-section">
        <div className="container">
          <div className="news-filters-bar">
            <div className="news-search-input-group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                className="news-search-input"
              />
            </div>

            <div className="news-filter-dropdowns">
              <div className="news-filter-dropdown">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <select
                  value={selectedAuthor}
                  onChange={(e) => {
                    setSelectedAuthor(e.target.value);
                    updateURLParams({ search: searchQuery, authorId: e.target.value, time: selectedTime, page: 1 });
                  }}
                  className="news-filter-select"
                >
                  <option value="">All Authors</option>
                </select>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <div className="news-filter-dropdown">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <select
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    updateURLParams({ search: searchQuery, authorId: selectedAuthor, time: e.target.value, page: 1 });
                  }}
                  className="news-filter-select"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-arrow">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="news-articles-section">
        <div className="container">
          {articles.length === 0 ? (
            <div className="news-no-results">
              <p>No articles found</p>
            </div>
          ) : (
            <>
              <div className="news-grid">
                {articles.map((article) => {
                  const bannerImage = article.contentImages?.length
                    ? article.contentImages[0].ref
                    : "/placeholder-news.png";

                  const category = getCategoryFromTags(article.tags);
                  const categoryColor = getCategoryColor(category);

                  return (
                    <div key={article.id} className="news-card" onClick={() => handleArticleClick(article.id)}>
                      <div className="news-card-image-wrapper">
                        <img
                          src={bannerImage}
                          alt={article.subject}
                          className="news-card-image"
                          onError={(e) => {
                            e.target.src = "/placeholder-news.png";
                          }}
                        />
                        <span className="news-card-badge" style={{ backgroundColor: categoryColor }}>
                          {category}
                        </span>
                      </div>

                      <div className="news-card-content">
                        <h3 className="news-card-title">{article.subject}</h3>

                        <p
                          className="news-card-description"
                          dangerouslySetInnerHTML={{
                            __html: article.content.text
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 120) + "..."
                          }}
                        ></p>

                        <div className="news-card-footer">
                          <div className="news-card-author">
                            <div className="news-author-avatar">
                              {article.author.displayName[0]}
                            </div>
                            <div className="news-author-info">
                              <div className="news-author-name">
                                {article.author.displayName}
                              </div>
                              <div className="news-author-role">
                                {article.author.jobTitle || "FUSO Employee"}
                              </div>
                            </div>
                          </div>

                          <div className="news-card-meta">
                            <div className="news-card-time">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              {getTimeAgo(article.published)}
                            </div>

                            <div className="news-card-stats">
                              <div className="news-stat-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <span>{article.likeCount || 0}</span>
                              </div>

                              <div className="news-stat-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>{article.commentCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <div className="news-pagination">
                  <button
                    className="news-pagination-btn"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Previous
                  </button>

                  <div className="news-pagination-numbers">
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`news-pagination-number ${
                            pageNum === pagination.currentPage ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                      <>
                        <span className="news-pagination-dots">...</span>
                        <button
                          className="news-pagination-number"
                          onClick={() => handlePageChange(pagination.totalPages)}
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    className="news-pagination-btn"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;

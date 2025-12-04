import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LikeButton from "../../components/LikeButton/LikeButton";
import "./News.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    tags: searchParams.get('tags') || '',
    authorId: searchParams.get('authorId') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

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
        page: filters.page,
        limit: 9,
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.authorId) params.append('authorId', filters.authorId);
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);

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

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURLParams({ ...filters, page: 1 });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    updateURLParams({ ...filters, page: 1 });
    setShowFilters(false);
  };

  const handleTagClick = (tagName) => {
    const newFilters = { ...filters, tags: tagName, page: 1 };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { search: '', tags: '', authorId: '', from: '', to: '', page: 1 };
    setFilters(clearedFilters);
    updateURLParams(clearedFilters);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateURLParams(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.tags) params.set('tags', newFilters.tags);
    if (newFilters.authorId) params.set('authorId', newFilters.authorId);
    if (newFilters.from) params.set('from', newFilters.from);
    if (newFilters.to) params.set('to', newFilters.to);
    if (newFilters.page > 1) params.set('page', newFilters.page);
    setSearchParams(params);
  };

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  const hasActiveFilters = filters.search || filters.tags || filters.authorId || filters.from || filters.to;

  if (loading) return <div className="loading-text">Loading News...</div>;

  return (
    <div className="news-page">
      <section className="news-header">
        <div className="container">
          <div className="header-top">
            <h1 className="news-page-title">MFTBC News</h1>
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="news-search-form">
            <div className="search-box-enhanced">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search news articles..."
                value={filters.search}
                onChange={handleSearchChange}
                className="search-input-enhanced"
              />
              <button type="submit" className="search-btn-enhanced">Search</button>
            </div>
          </form>

          {showFilters && (
            <div className="advanced-filters">
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Tag</label>
                  <input
                    type="text"
                    placeholder="e.g., Manufacturing"
                    value={filters.tags}
                    onChange={(e) => handleFilterChange('tags', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Author ID</label>
                  <input
                    type="number"
                    placeholder="e.g., 1"
                    value={filters.authorId}
                    onChange={(e) => handleFilterChange('authorId', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">From Date</label>
                  <input
                    type="date"
                    value={filters.from}
                    onChange={(e) => handleFilterChange('from', e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">To Date</label>
                  <input
                    type="date"
                    value={filters.to}
                    onChange={(e) => handleFilterChange('to', e.target.value)}
                    className="filter-input"
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button type="button" onClick={applyFilters} className="btn-apply-filters">
                  Apply Filters
                </button>
                <button type="button" onClick={clearFilters} className="btn-clear-filters">
                  Clear All
                </button>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="active-filters">
              {filters.search && (
                <span className="filter-tag">
                  Search: {filters.search}
                  <button onClick={() => {
                    setFilters(prev => ({ ...prev, search: '', page: 1 }));
                    updateURLParams({ ...filters, search: '', page: 1 });
                  }}>×</button>
                </span>
              )}
              {filters.tags && (
                <span className="filter-tag">
                  Tag: {filters.tags}
                  <button onClick={() => {
                    setFilters(prev => ({ ...prev, tags: '', page: 1 }));
                    updateURLParams({ ...filters, tags: '', page: 1 });
                  }}>×</button>
                </span>
              )}
              {filters.authorId && (
                <span className="filter-tag">
                  Author ID: {filters.authorId}
                  <button onClick={() => {
                    setFilters(prev => ({ ...prev, authorId: '', page: 1 }));
                    updateURLParams({ ...filters, authorId: '', page: 1 });
                  }}>×</button>
                </span>
              )}
              {filters.from && (
                <span className="filter-tag">
                  From: {new Date(filters.from).toLocaleDateString()}
                  <button onClick={() => {
                    setFilters(prev => ({ ...prev, from: '', page: 1 }));
                    updateURLParams({ ...filters, from: '', page: 1 });
                  }}>×</button>
                </span>
              )}
              {filters.to && (
                <span className="filter-tag">
                  To: {new Date(filters.to).toLocaleDateString()}
                  <button onClick={() => {
                    setFilters(prev => ({ ...prev, to: '', page: 1 }));
                    updateURLParams({ ...filters, to: '', page: 1 });
                  }}>×</button>
                </span>
              )}
            </div>
          )}

          {pagination.totalItems > 0 && (
            <p className="results-count">
              Showing {articles.length} of {pagination.totalItems} articles
              {pagination.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
            </p>
          )}
        </div>
      </section>

      <section className="news-content">
        <div className="container">
          {articles.length === 0 ? (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3>No articles found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="row g-4">
                {articles.map((article) => {
                  const bannerImage = article.contentImages?.length
                    ? article.contentImages[0].ref
                    : "/placeholder-news.png";

                  return (
                    <div key={article.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        className="news-article-card"
                        onClick={() => handleArticleClick(article.id)}
                      >
                        <div className="article-image-wrapper">
                          <img
                            src={bannerImage}
                            alt={article.subject}
                            className="article-image"
                            onError={(e) => {
                              e.target.src = "/placeholder-news.png";
                            }}
                          />
                          <span className="article-category red">News</span>
                        </div>

                        <div className="article-content">
                          <h3 className="article-title">{article.subject}</h3>

                          <p
                            className="article-description"
                            dangerouslySetInnerHTML={{
                              __html: article.content.text
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 150) + "..."
                            }}
                          ></p>

                          {article.tags && article.tags.length > 0 && (
                            <div className="article-tags">
                              {article.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="article-tag"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTagClick(tag);
                                  }}
                                >
                                  #{tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="article-tag-more">
                                  +{article.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="article-footer">
                            <div className="article-author">
                              <div className="author-avatar">
                                {article.author.displayName[0]}
                              </div>
                              <div className="author-info">
                                <div className="author-name">
                                  {article.author.displayName}
                                </div>
                                <div className="author-role">
                                  {new Date(article.published).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div
                              className="article-actions"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <LikeButton
                                blogId={article.id}
                                initialLikeCount={article.likeCount}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Previous
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                      let page;
                      if (pagination.totalPages <= 7) {
                        page = i + 1;
                      } else if (pagination.currentPage <= 4) {
                        page = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 3) {
                        page = pagination.totalPages - 6 + i;
                      } else {
                        page = pagination.currentPage - 3 + i;
                      }

                      return (
                        <button
                          key={page}
                          className={`pagination-number ${
                            page === pagination.currentPage ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="pagination-btn"
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

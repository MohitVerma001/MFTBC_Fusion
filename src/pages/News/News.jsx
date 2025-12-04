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
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    tags: searchParams.get('tags') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const navigate = useNavigate();
  const baseURL = API_URL.replace("/api", "");

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

  const handleTagClick = (tagName) => {
    const newFilters = { ...filters, tags: tagName, page: 1 };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { search: '', tags: '', page: 1 };
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
    if (newFilters.page > 1) params.set('page', newFilters.page);
    setSearchParams(params);
  };

  const handleArticleClick = (articleId) => {
    navigate(`/news/${articleId}`);
  };

  if (loading) return <div className="loading-text">Loading News...</div>;

  return (
    <div className="news-page">
      <section className="news-header">
        <div className="container">
          <h1 className="news-page-title">Latest News</h1>

          <form onSubmit={handleSearchSubmit} className="news-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search news..."
                value={filters.search}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-btn">Search</button>
            </div>

            {(filters.search || filters.tags) && (
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
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              </div>
            )}
          </form>

          {pagination.totalItems > 0 && (
            <p className="results-count">
              Showing {articles.length} of {pagination.totalItems} articles
            </p>
          )}
        </div>
      </section>

      <section className="news-content">
        <div className="container">
          {articles.length === 0 ? (
            <div className="no-results">
              <p>No news articles found matching your criteria.</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
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
                          />
                          <span className="article-category red">News</span>
                        </div>

                        <div className="article-content">
                          <h3 className="article-title">{article.subject}</h3>

                          <p
                            className="article-description"
                            dangerouslySetInnerHTML={{
                              __html: article.content.text
                                .replace("<body>", "")
                                .replace("</body>", "")
                                .substring(0, 150) + "..."
                            }}
                          ></p>

                          {article.tags && article.tags.length > 0 && (
                            <div className="article-tags">
                              {article.tags.map((tag, idx) => (
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
                    « Previous
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`pagination-number ${
                            page === pagination.currentPage ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next »
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

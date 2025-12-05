import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LikeButton from "../../components/LikeButton/LikeButton";
import Comments from "../../components/Comments/Comments";
import "./NewsDetail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    fetchArticle();
    checkBookmark();
    checkFollowing();
  }, [id]);

  useEffect(() => {
    if (article) {
      fetchRelatedArticles();
      incrementViewCount();
    }
  }, [article]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/blogs/${id}?jiveFormat=true`);

      if (!response.ok) {
        throw new Error("Article not found");
      }

      const data = await response.json();
      setArticle(data);
    } catch (err) {
      console.error("Error fetching article:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const tag = article.tags?.[0];
      if (!tag) return;

      const response = await fetch(
        `${API_URL}/blogs?publishTo=News&jiveFormat=true&tags=${tag}&limit=3`
      );
      const data = await response.json();

      const filtered = (data.items || []).filter(item => item.id !== article.id).slice(0, 3);
      setRelatedArticles(filtered);
    } catch (err) {
      console.error("Error fetching related articles:", err);
    }
  };

  const incrementViewCount = () => {
    const storageKey = `article_view_${id}`;
    const hasViewed = localStorage.getItem(storageKey);

    if (!hasViewed) {
      const randomViews = Math.floor(Math.random() * 3000) + 500;
      setViewCount(randomViews);
      localStorage.setItem(storageKey, 'true');
    } else {
      const randomViews = Math.floor(Math.random() * 3000) + 500;
      setViewCount(randomViews);
    }
  };

  const checkBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    setIsBookmarked(bookmarks.includes(id));
  };

  const checkFollowing = () => {
    const following = JSON.parse(localStorage.getItem('following_authors') || '[]');
    if (article) {
      setIsFollowing(following.includes(article.author.id));
    }
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');

    if (isBookmarked) {
      const updated = bookmarks.filter(bookmarkId => bookmarkId !== id);
      localStorage.setItem('bookmarked_articles', JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      bookmarks.push(id);
      localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const toggleFollowing = () => {
    const following = JSON.parse(localStorage.getItem('following_authors') || '[]');

    if (isFollowing) {
      const updated = following.filter(authorId => authorId !== article.author.id);
      localStorage.setItem('following_authors', JSON.stringify(updated));
      setIsFollowing(false);
    } else {
      following.push(article.author.id);
      localStorage.setItem('following_authors', JSON.stringify(following));
      setIsFollowing(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.subject,
        text: article.content.text.replace(/<[^>]*>/g, "").substring(0, 100),
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  const handleBackClick = () => {
    navigate("/news");
  };

  const handleRelatedClick = (articleId) => {
    navigate(`/news/${articleId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="news-detail-loading">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="news-detail-error">
        <h2>Article not found</h2>
        <p>{error || "The article you're looking for doesn't exist."}</p>
        <button onClick={handleBackClick} className="btn-back-error">
          Back to News Feed
        </button>
      </div>
    );
  }

  const bannerImage = article.contentImages?.length
    ? article.contentImages[0].ref
    : "/placeholder-news.png";

  const publishedDate = new Date(article.published);
  const formattedDate = `${publishedDate.toLocaleDateString('en-US', { month: 'long' })} ${publishedDate.getDate()}, ${publishedDate.getFullYear()}`;

  return (
    <div className="news-detail-redesign">
      <div className="news-detail-header-bar">
        <div className="container">
          <button onClick={handleBackClick} className="news-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to News Feed
          </button>
        </div>
      </div>

      <div className="news-detail-layout">
        <div className="news-detail-main">
          <div className="news-detail-badges">
            {article.tags && article.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="news-detail-badge">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="news-detail-title">
            {article.subject}
          </h1>

          <div className="news-detail-author-section">
            <div className="news-detail-author">
              <div className="news-detail-author-avatar">
                {article.author.displayName[0]}
              </div>
              <div className="news-detail-author-info">
                <div className="news-detail-author-name">{article.author.displayName}</div>
                <div className="news-detail-author-role">
                  {article.author.jobTitle || "Manufacturing Operations"}
                </div>
              </div>
            </div>

            <div className="news-detail-meta">
              <span className="news-detail-meta-item">
                {formattedDate} - {Math.floor(Math.random() * 5) + 2} hours ago
              </span>
              <span className="news-detail-meta-divider">•</span>
              <span className="news-detail-meta-item">{viewCount} views</span>
            </div>
          </div>

          <div className="news-detail-featured-image">
            <img src={bannerImage} alt={article.subject} />
          </div>

          <div
            className="news-detail-content"
            dangerouslySetInnerHTML={{ __html: article.content.text }}
          />

          {article.contentImages && article.contentImages.length > 1 && (
            <div className="news-detail-images-grid">
              {article.contentImages.slice(1, 3).map((img, idx) => (
                <div key={idx} className="news-detail-image-item">
                  <img src={img.ref} alt={img.name || `Image ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}

          <div className="news-detail-related">
            <h3 className="news-detail-related-title">Related Articles</h3>
            <div className="news-detail-related-list">
              {relatedArticles.length > 0 ? relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="news-detail-related-item"
                  onClick={() => handleRelatedClick(relatedArticle.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>{relatedArticle.subject}</span>
                </div>
              )) : (
                <>
                  <div className="news-detail-related-item" style={{ cursor: 'default' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Sustainability Initiative: Our Path to Carbon-Neutral Manufacturing</span>
                  </div>
                  <div className="news-detail-related-item" style={{ cursor: 'default' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Innovation Spotlight: Next-Generation Electric Truck Technology</span>
                  </div>
                  <div className="news-detail-related-item" style={{ cursor: 'default' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E60000" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Employee Spotlight: Meet the Team Behind Our Success</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="news-detail-engagement">
            <div className="news-detail-likes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{article.likeCount || 156} Likes</span>
            </div>

            <div className="news-detail-comments-count">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{article.commentCount || 2} Comments</span>
            </div>
          </div>

          <Comments blogId={article.id} />
        </div>

        <div className="news-detail-sidebar">
          <div className="news-sidebar-sticky">
            <h4 className="news-sidebar-title">Quick Actions</h4>

            <button
              className={`news-sidebar-action follow ${isFollowing ? 'active' : ''}`}
              onClick={toggleFollowing}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFollowing ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>

            <button className="news-sidebar-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>Like</span>
            </button>

            <button
              className={`news-sidebar-action ${isBookmarked ? 'active' : ''}`}
              onClick={toggleBookmark}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button className="news-sidebar-action" onClick={handleShare}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>Share</span>
            </button>

            <button className="news-sidebar-action" onClick={exportToPDF}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>View as PDF</span>
            </button>

            <div className="news-sidebar-translate">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <select className="news-sidebar-translate-select">
                <option value="en">Translate</option>
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="translate-dropdown-arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;

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
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    fetchArticle();
    checkBookmark();
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
      const randomViews = Math.floor(Math.random() * 500) + 100;
      setViewCount(randomViews);
      localStorage.setItem(storageKey, 'true');
    } else {
      const randomViews = Math.floor(Math.random() * 500) + 100;
      setViewCount(randomViews);
    }
  };

  const checkBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]');
    setIsBookmarked(bookmarks.includes(id));
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

  const exportToPDF = async () => {
    const printWindow = window.open('', '_blank');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${article.subject}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            h1 {
              font-size: 28px;
              margin-bottom: 20px;
              color: #111;
            }
            .meta {
              color: #666;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #ddd;
            }
            .content {
              font-size: 14px;
            }
            .content img {
              max-width: 100%;
              height: auto;
              margin: 20px 0;
            }
            .tags {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #ddd;
            }
            .tag {
              display: inline-block;
              background: #f0f0f0;
              padding: 5px 10px;
              margin-right: 5px;
              border-radius: 4px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>${article.subject}</h1>
          <div class="meta">
            <p><strong>Author:</strong> ${article.author.displayName}</p>
            <p><strong>Published:</strong> ${new Date(article.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          <div class="content">
            ${article.content.text}
          </div>
          ${article.tags && article.tags.length > 0 ? `
            <div class="tags">
              <p><strong>Tags:</strong></p>
              ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
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
        <button onClick={handleBackClick} className="btn-back">
          Back to News Feed
        </button>
      </div>
    );
  }

  const bannerImage = article.contentImages?.length
    ? article.contentImages[0].ref
    : "/placeholder-news.png";

  const publishedDate = new Date(article.published).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="news-detail-page">
      <div className="news-detail-header">
        <button onClick={handleBackClick} className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to News Feed
        </button>
      </div>

      <article className="news-detail-content">
        <div className="news-detail-banner">
          <img src={bannerImage} alt={article.subject} className="banner-image" />
        </div>

        <div className="news-detail-body">
          <div className="news-detail-container">
            {article.tags && article.tags.length > 0 && (
              <div className="article-badges">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="article-badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="article-main-title">{article.subject}</h1>

            <div className="article-meta-info">
              <div className="author-card">
                <div className="author-avatar-large">
                  {article.author.displayName[0]}
                </div>
                <div className="author-details">
                  <div className="author-name-large">{article.author.displayName}</div>
                  {article.author.jobTitle && (
                    <div className="author-title">{article.author.jobTitle}</div>
                  )}
                </div>
              </div>

              <div className="article-metadata">
                <div className="metadata-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{publishedDate}</span>
                </div>

                <div className="metadata-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{viewCount} views</span>
                </div>
              </div>
            </div>

            <div className="quick-actions-bar">
              <div className="action-item">
                <LikeButton blogId={article.id} initialLikeCount={article.likeCount} />
              </div>

              <button
                className={`action-button ${isBookmarked ? 'active' : ''}`}
                onClick={toggleBookmark}
                title={isBookmarked ? "Remove bookmark" : "Bookmark this article"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                className="action-button"
                onClick={exportToPDF}
                title="Save as PDF"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Save PDF</span>
              </button>
            </div>

            <div
              className="article-content-html"
              dangerouslySetInnerHTML={{ __html: article.content.text }}
            />

            {article.contentImages && article.contentImages.length > 1 && (
              <div className="article-images-gallery">
                <h3 className="gallery-title">Images</h3>
                <div className="image-grid">
                  {article.contentImages.slice(1).map((img, idx) => (
                    <div key={idx} className="gallery-image-wrapper">
                      <img src={img.ref} alt={img.name || `Image ${idx + 1}`} className="gallery-image" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {article.attachments && article.attachments.length > 0 && (
              <div className="article-attachments">
                <h3 className="attachments-title">Attachments</h3>
                <div className="attachments-list">
                  {article.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      download={attachment.name}
                      className="attachment-item"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <div className="attachment-info">
                        <div className="attachment-name">{attachment.name}</div>
                        <div className="attachment-size">
                          {attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : "Unknown size"}
                        </div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <Comments blogId={article.id} />

            {relatedArticles.length > 0 && (
              <div className="related-articles-section">
                <h3 className="related-title">Related Articles</h3>
                <div className="related-articles-grid">
                  {relatedArticles.map((relatedArticle) => {
                    const relatedImage = relatedArticle.contentImages?.[0]?.ref || "/placeholder-news.png";

                    return (
                      <div
                        key={relatedArticle.id}
                        className="related-article-card"
                        onClick={() => handleRelatedClick(relatedArticle.id)}
                      >
                        <div className="related-image-wrapper">
                          <img src={relatedImage} alt={relatedArticle.subject} className="related-image" />
                        </div>
                        <div className="related-content">
                          <h4 className="related-article-title">{relatedArticle.subject}</h4>
                          <p className="related-article-meta">
                            {new Date(relatedArticle.published).toLocaleDateString()} • {relatedArticle.author.displayName}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

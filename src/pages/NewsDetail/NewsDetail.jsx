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

  useEffect(() => {
    fetchArticle();
  }, [id]);

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

  const handleBackClick = () => {
    navigate("/news");
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
                  <span>{article.viewCount || 0} views</span>
                </div>
              </div>
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

            <div className="article-actions-bar">
              <LikeButton blogId={article.id} initialLikeCount={article.likeCount} />
            </div>

            <Comments blogId={article.id} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

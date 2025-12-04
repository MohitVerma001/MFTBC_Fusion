import React, { useEffect, useState } from "react";
import "./News.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = API_URL.replace("/api", ""); // http://localhost:5000

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs?publishTo=News&jiveFormat=true`);
      const data = await res.json();
      setArticles(data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading-text">Loading News...</div>;

  return (
    <div className="news-page">
      <section className="news-content">
        <div className="container">
          <div className="row g-4">

            {articles.map((article) => {
              const bannerImage = article.contentImages?.length
                ? `${baseURL}${article.contentImages[0].ref}`
                : "/placeholder-news.png";

              return (
                <div key={article.id} className="col-12 col-md-6 col-lg-4">
                  <div className="news-article-card">

                    {/* IMAGE */}
                    <div className="article-image-wrapper">
                      <img
                        src={bannerImage}
                        alt={article.subject}
                        className="article-image"
                      />
                      <span className="article-category red">News</span>
                    </div>

                    {/* CONTENT */}
                    <div className="article-content">
                      <h3 className="article-title">{article.subject}</h3>

                      <p
                        className="article-description"
                        dangerouslySetInnerHTML={{
                          __html: article.content.text.replace("<body>", "").replace("</body>", "")
                        }}
                      ></p>

                      <div className="article-footer">
                        <div className="article-author">
                          <div className="author-avatar">{article.author.displayName[0]}</div>
                          <div className="author-info">
                            <div className="author-name">{article.author.displayName}</div>
                            <div className="author-role">Corporate Communications</div>
                          </div>
                        </div>

                        <div className="article-meta">
                          <span className="article-time">
                            {new Date(article.published).toLocaleString()}
                          </span>

                          <div className="article-stats">
                            <span className="stat">👍 {article.likeCount}</span>
                            <span className="stat">💬 {article.comments || 0}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </section>
    </div>
  );
};

export default News;

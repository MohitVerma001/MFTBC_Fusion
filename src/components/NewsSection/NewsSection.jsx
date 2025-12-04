import React, { useEffect, useState } from "react";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./NewsSection.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        `${API_URL}/blogs?publish_to=News&jiveFormat=true`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setNews(data);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return <div className="container">Loading news...</div>;
  }

  return (
    <section className="news-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="section-title">Latest News</h2>
            <button className="view-all-btn">
              View All
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="row g-4">
          {news.map((item) => {
            const image =
              item.contentImages?.[0]?.ref || "/placeholder-news.png";

            const description =
              item.content?.text
                ?.replace("<body>", "")
                ?.replace("</body>", "")
                ?.replace(/<[^>]*>?/gm, "") // remove HTML
                ?.slice(0, 120) + "...";

            return (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="news-card">
                  <div className="news-image">
                    <ImageLoader
                      src={image}
                      alt={item.subject}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="news-content">
                    <h3 className="news-title">{item.subject}</h3>
                    <p className="news-description">{description}</p>
                    <p className="news-time">
                      {new Date(item.published).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {news.length === 0 && (
            <div className="col-12 text-center">No news available.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

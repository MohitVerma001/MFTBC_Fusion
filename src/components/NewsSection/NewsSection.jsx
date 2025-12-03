import React from "react";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./NewsSection.css";

const NewsSection = () => {
  const newsData = [
    {
      image: "/img-119.png",
      title: "FUSO Announces New Sustainability Initiative",
      description:
        "Leading the way in green transportation with innovative electric vehicle technology and carbon-neutral manufacturing processes.",
      time: "2 hours ago",
    },
    {
      image: "/img-132.png",
      title: "Q4 Town Hall Meeting Highlights and Key Takeaways",
      description:
        "CEO shares vision for 2024 growth strategy and celebrates team achievements across all departments and regions.",
      time: "5 hours ago",
    },
    {
      image: "/img-145.png",
      title: "New Manufacturing Facility Opens in Southeast Asia",
      description:
        "State-of-the-art production plant brings cutting-edge technology and creates hundreds of new employment opportunities.",
      time: "1 day ago",
    },
  ];

  return (
    <section className="news-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h2 className="section-title">Latest News</h2>
            <button className="view-all-btn">
              View All
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ms-1"
              >
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
          {newsData.map((news, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="news-card">
                <div className="news-image">
                  <ImageLoader src={news.image} alt={news.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="news-content">
                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-description">{news.description}</p>
                  <p className="news-time">{news.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

import React, { useState } from "react";
import "./News.css";

const News = () => {
  const [selectedAuthor, setSelectedAuthor] = useState("All Authors");
  const [selectedTime, setSelectedTime] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");

  const newsArticles = [
    {
      id: 1,
      image: "/img-119.png",
      category: "Achievement",
      categoryColor: "red",
      title: "FUSO Achieves Record-Breaking Production Milestone",
      description:
        "Our manufacturing facilities across Asia have successfully produced the 500,000th commercial vehicle.",
      author: {
        name: "Michael Chen",
        role: "Manufacturing Operations",
        avatar: "MC",
      },
      time: "2 hours ago",
      likes: 156,
      comments: 42,
    },
    {
      id: 2,
      image: "/img-132.png",
      category: "HR",
      categoryColor: "red",
      title: "New Employee Wellness Program Launches Across All Locations",
      description:
        "Daimler Truck Asia introduces comprehensive wellness initiative featuring mental health support, fitness",
      author: {
        name: "Lisa Wang",
        role: "Human Resources",
        avatar: "LW",
      },
      time: "5 hours ago",
      likes: 203,
      comments: 67,
    },
    {
      id: 3,
      image: "/img-145.png",
      category: "Sustainability",
      categoryColor: "red",
      title: "Sustainability Audit Results: Exceeding Environmental Goals",
      description:
        "Our latest sustainability audit reveals outstanding progress in reducing carbon emissions, waste",
      author: {
        name: "Robert Schneider",
        role: "Sustainability & Environment",
        avatar: "RS",
      },
      time: "8 hours ago",
      likes: 189,
      comments: 53,
    },
    {
      id: 4,
      image: "/img-386.png",
      category: "Leadership",
      categoryColor: "red",
      title: "Q4 Town Hall: CEO Shares 2025 Vision and Strategic Priorities",
      description:
        "Leadership team presents comprehensive overview of company performance, celebrates achievements, and",
      author: {
        name: "Jennifer Park",
        role: "Corporate Communications",
        avatar: "JP",
      },
      time: "1 day ago",
      likes: 243,
      comments: 89,
    },
    {
      id: 5,
      image: "/img-497.png",
      category: "Expansion",
      categoryColor: "red",
      title: "New Manufacturing Facility Opens in Southeast Asia",
      description:
        "State-of-the-art production plant in Thailand begins operations, featuring cutting-edge automation technology",
      author: {
        name: "Somchai Pattana",
        role: "Operations - Southeast Asia",
        avatar: "SP",
      },
      time: "2 days ago",
      likes: 312,
      comments: 95,
    },
    {
      id: 6,
      image: "/img-119.png",
      category: "IT",
      categoryColor: "red",
      title: "Digital Transformation: New IT Systems Go Live",
      description:
        "Company-wide rollout of integrated enterprise resource planning system enhances operational efficiency, data",
      author: {
        name: "Michael Schmidt",
        role: "Information Technology",
        avatar: "MS",
      },
      time: "3 days ago",
      likes: 167,
      comments: 58,
    },
  ];

  return (
    <div className="news-page">
      {/* News Grid */}
      <section className="news-content">
        <div className="container">
          <div className="row g-4">
            {newsArticles.map((article) => (
              <div key={article.id} className="col-12 col-md-6 col-lg-4">
                <div className="news-article-card">
                  <div className="article-image-wrapper">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="article-image"
                    />
                    <span className={`article-category ${article.categoryColor}`}>
                      {article.category}
                    </span>
                  </div>
                  <div className="article-content">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-description">{article.description}</p>
                    <div className="article-footer">
                      <div className="article-author">
                        <div className="author-avatar">{article.author.avatar}</div>
                        <div className="author-info">
                          <div className="author-name">{article.author.name}</div>
                          <div className="author-role">{article.author.role}</div>
                        </div>
                      </div>
                      <div className="article-meta">
                        <span className="article-time">{article.time}</span>
                        <div className="article-stats">
                          <span className="stat">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                                stroke="#6B7280"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {article.likes}
                          </span>
                          <span className="stat">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 10C14 10.5304 13.7893 11.0391 13.4142 11.4142C13.0391 11.7893 12.5304 12 12 12H4L2 14V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H12C12.5304 2 13.0391 2.21071 13.4142 2.58579C13.7893 2.96086 14 3.46957 14 4V10Z"
                                stroke="#6B7280"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {article.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="news-pagination">
            <button className="pagination-btn prev">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous
            </button>
            <div className="pagination-numbers">
              <button className="pagination-number active">1</button>
              <button className="pagination-number">2</button>
              <button className="pagination-number">3</button>
              <span className="pagination-dots">...</span>
              <button className="pagination-number">15</button>
            </div>
            <button className="pagination-btn next">
              Next
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;

import React from "react";
import ImageLoader from "../ImageLoader/ImageLoader";
import "./SocialFeed.css";

const SocialFeed = () => {
  const socialPosts = [
    {
      initials: "DM",
      name: "David Martinez",
      role: "Engineering Manager",
      time: "2h ago",
      content:
        "Great team collaboration today on the new electric truck prototype. Proud of what we are achieving together at FUSO!",
      image: "/img-386.png",
      likes: 42,
      comments: 12,
    },
    {
      initials: "LW",
      name: "Lisa Wang",
      role: "HR Business Partner",
      time: "4h ago",
      content:
        "Reminder: Employee wellness program registration closes this Friday. Take advantage of our comprehensive health and fitness benefits!",
      image: null,
      likes: 28,
      comments: 5,
    },
  ];

  return (
    <section className="social-feed-section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="section-title">Social Activity Highlights</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {socialPosts.map((post, index) => (
              <div key={index} className="social-post-card mb-4">
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-avatar">{post.initials}</div>
                  <div className="post-author-info">
                    <div className="post-author-name">
                      {post.name}
                      <span className="post-time"> · {post.time}</span>
                    </div>
                    <div className="post-author-role">{post.role}</div>
                  </div>
                  <button className="post-menu-btn">
                    <ImageLoader src="/button-422.svg" alt="More options" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="post-content">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="post-image">
                    <ImageLoader src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-actions">
                  <button className="action-btn">
                    <ImageLoader src="/i-389.svg" alt="Like" className="action-icon" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="action-btn">
                    <ImageLoader src="/i-436.svg" alt="Comment" className="action-icon" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="action-btn">
                    <ImageLoader src="/i-442.svg" alt="Share" className="action-icon" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;

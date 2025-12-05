import React, { useState, useEffect } from 'react';
import { engagementApi } from '../../services/engagement.api';
import './LikeButton.css';

const LikeButton = ({ blogId, initialLikeCount = 0, initialLiked = false }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLikeStatus = async () => {
      const [likeStatus, countResult] = await Promise.all([
        engagementApi.checkUserLiked(blogId),
        engagementApi.getLikeCount(blogId)
      ]);

      if (likeStatus.success) {
        setLiked(likeStatus.liked);
      }

      if (countResult.success) {
        setLikeCount(countResult.count);
      }
    };

    loadLikeStatus();
  }, [blogId]);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await engagementApi.toggleLike(blogId);

      if (result.success) {
        setLiked(result.liked);
        setLikeCount(result.likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`like-button ${liked ? 'liked' : ''}`}
      onClick={handleLike}
      disabled={loading}
    >
      <svg
        className="like-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

export default LikeButton;

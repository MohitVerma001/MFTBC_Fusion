import React, { useState, useEffect } from 'react';
import { engagementApi } from '../../services/engagement.api';
import './Comments.css';

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    const savedName = localStorage.getItem('user_display_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await engagementApi.getComments(blogId);

      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const displayName = userName.trim() || 'Anonymous';

    if (userName.trim()) {
      localStorage.setItem('user_display_name', userName.trim());
    }

    setSubmitting(true);

    try {
      const result = await engagementApi.addComment(blogId, newComment, displayName);

      if (result.success) {
        setNewComment('');
        await fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const result = await engagementApi.deleteComment(commentId);

      if (result.success) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name (optional)"
          className="comment-name-input"
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
          className="comment-textarea"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="comment-submit-btn"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading ? (
        <div className="comments-loading">Loading comments...</div>
      ) : (
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author">
                    <span className="author-avatar">
                      {(comment.user_name || 'A').charAt(0).toUpperCase()}
                    </span>
                    <div className="author-info">
                      <span className="author-name">
                        {comment.user_name || 'Anonymous'}
                      </span>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="comment-delete-btn"
                    title="Delete comment"
                  >
                    ×
                  </button>
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;

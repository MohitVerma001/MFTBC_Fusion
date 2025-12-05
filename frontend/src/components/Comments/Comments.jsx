import React, { useState, useEffect } from 'react';
import { blogsApi } from '../../services';
import './Comments.css';

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await blogsApi.getComments(blogId);

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

    setSubmitting(true);

    try {
      const result = await blogsApi.addComment(blogId, {
        comment: newComment,
        userId: 1,
      });

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
      const response = await fetch(`${API_URL}/blogs/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }),
      });

      const result = await response.json();

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
                      {(comment.display_name || comment.email || 'U').charAt(0).toUpperCase()}
                    </span>
                    <div className="author-info">
                      <span className="author-name">
                        {comment.display_name || comment.email || 'User'}
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAnonymousUserId = () => {
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

export const engagementApi = {
  async toggleLike(blogId) {
    try {
      const userId = getAnonymousUserId();

      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getLikeCount(blogId) {
    try {
      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/like/count`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting like count:', error);
      return {
        success: false,
        count: 0
      };
    }
  },

  async checkUserLiked(blogId) {
    try {
      const userId = getAnonymousUserId();

      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/like/check`, {
        headers: {
          'x-user-id': userId
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking user liked:', error);
      return {
        success: false,
        liked: false
      };
    }
  },

  async addComment(blogId, content, userName = 'Anonymous', parentCommentId = null) {
    try {
      const userId = getAnonymousUserId();

      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({
          userId,
          comment: content,
          userName,
          parentCommentId
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getComments(blogId) {
    try {
      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/comments`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting comments:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await fetch(`${API_URL}/engagement/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async toggleBookmark(blogId) {
    try {
      const userId = getAnonymousUserId();

      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async checkUserBookmarked(blogId) {
    try {
      const userId = getAnonymousUserId();

      const response = await fetch(`${API_URL}/engagement/blogs/${blogId}/bookmark/check`, {
        headers: {
          'x-user-id': userId
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking user bookmarked:', error);
      return {
        success: false,
        bookmarked: false
      };
    }
  }
};

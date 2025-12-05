import pool from '../utils/db.js';

const getAnonymousUserId = (req) => {
  return req.body.userId || req.headers['x-user-id'] || 'anonymous';
};

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = getAnonymousUserId(req);

    const checkQuery = 'SELECT * FROM blog_likes WHERE blog_id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [blogId, userId]);

    if (checkResult.rows.length > 0) {
      await pool.query('DELETE FROM blog_likes WHERE id = $1', [checkResult.rows[0].id]);

      const countResult = await pool.query('SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = $1', [blogId]);

      return res.json({
        success: true,
        liked: false,
        likeCount: parseInt(countResult.rows[0].count)
      });
    } else {
      await pool.query('INSERT INTO blog_likes (blog_id, user_id) VALUES ($1, $2)', [blogId, userId]);

      const countResult = await pool.query('SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = $1', [blogId]);

      return res.json({
        success: true,
        liked: true,
        likeCount: parseInt(countResult.rows[0].count)
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
};

export const getLikeCount = async (req, res) => {
  try {
    const { blogId } = req.params;

    const result = await pool.query('SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = $1', [blogId]);

    res.json({
      success: true,
      count: parseInt(result.rows[0].count)
    });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({
      success: false,
      count: 0
    });
  }
};

export const checkUserLiked = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = getAnonymousUserId(req);

    const result = await pool.query('SELECT * FROM blog_likes WHERE blog_id = $1 AND user_id = $2', [blogId, userId]);

    res.json({
      success: true,
      liked: result.rows.length > 0
    });
  } catch (error) {
    console.error('Error checking user liked:', error);
    res.status(500).json({
      success: false,
      liked: false
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment, userName = 'Anonymous', parentCommentId = null } = req.body;
    const userId = getAnonymousUserId(req);

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const query = `
      INSERT INTO blog_comments (blog_id, user_id, user_name, comment, parent_comment_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [blogId, userId, userName, comment, parentCommentId]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const query = `
      SELECT * FROM blog_comments
      WHERE blog_id = $1 AND parent_comment_id IS NULL
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [blogId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({
      success: false,
      data: []
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    await pool.query('DELETE FROM blog_comments WHERE id = $1', [commentId]);

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = getAnonymousUserId(req);

    const checkQuery = 'SELECT * FROM blog_bookmarks WHERE blog_id = $1 AND user_id = $2';
    const checkResult = await pool.query(checkQuery, [blogId, userId]);

    if (checkResult.rows.length > 0) {
      await pool.query('DELETE FROM blog_bookmarks WHERE id = $1', [checkResult.rows[0].id]);

      return res.json({
        success: true,
        bookmarked: false
      });
    } else {
      await pool.query('INSERT INTO blog_bookmarks (blog_id, user_id) VALUES ($1, $2)', [blogId, userId]);

      return res.json({
        success: true,
        bookmarked: true
      });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling bookmark',
      error: error.message
    });
  }
};

export const checkUserBookmarked = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = getAnonymousUserId(req);

    const result = await pool.query('SELECT * FROM blog_bookmarks WHERE blog_id = $1 AND user_id = $2', [blogId, userId]);

    res.json({
      success: true,
      bookmarked: result.rows.length > 0
    });
  } catch (error) {
    console.error('Error checking user bookmarked:', error);
    res.status(500).json({
      success: false,
      bookmarked: false
    });
  }
};

import pool from '../utils/db.js';

const getBaseUrl = () => {
  return process.env.BASE_URL || 'http://localhost:5000';
};

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = getBaseUrl();
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
};

export const BlogModel = {

  async create(blogData) {
    const {
      title,
      content,
      content_html,
      publish_to,
      category_id,
      space_id,
      place_id,
      restricted_comments,
      is_place_blog,
      author_id,
      status,
      published_at
    } = blogData;

    const result = await pool.query(
      `INSERT INTO blogs (
        title, content, content_html, publish_to, category_id, space_id, place_id,
        restricted_comments, is_place_blog, author_id, status, published_at,
        created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
      RETURNING *`,
      [
        title,
        content || '',
        content_html || content || '',
        publish_to,
        category_id || null,
        space_id || null,
        place_id || null,
        restricted_comments || false,
        is_place_blog || false,
        author_id || 1,
        status || 'published',
        published_at || new Date()
      ]
    );

    return result.rows[0];
  },

  async findAll(filters = {}) {
    const params = [];
    let where = 'WHERE 1=1';
    let i = 1;

    // ----- APPLY FILTERS -----
    if (filters.publishTo) {
      where += ` AND b.publish_to = $${i}`;
      params.push(filters.publishTo);
      i++;
    }

    if (filters.categoryId) {
      where += ` AND b.category_id = $${i}`;
      params.push(filters.categoryId);
      i++;
    }

    if (filters.spaceId) {
      where += ` AND b.space_id = $${i}`;
      params.push(filters.spaceId);
      i++;
    }

    if (filters.placeId) {
      where += ` AND b.place_id = $${i}`;
      params.push(filters.placeId);
      i++;
    }

    if (filters.authorId) {
      where += ` AND b.author_id = $${i}`;
      params.push(filters.authorId);
      i++;
    }

    if (filters.search) {
      where += ` AND (b.title ILIKE $${i} OR b.content ILIKE $${i})`;
      params.push(`%${filters.search}%`);
      i++;
    }

    if (filters.tags) {
      where += ` AND EXISTS (
        SELECT 1 FROM blog_tags bt
        JOIN tags t ON bt.tag_id = t.id
        WHERE bt.blog_id = b.id AND t.name = $${i}
      )`;
      params.push(filters.tags);
      i++;
    }

    if (filters.from) {
      where += ` AND b.published_at >= $${i}`;
      params.push(filters.from);
      i++;
    }

    if (filters.to) {
      where += ` AND b.published_at <= $${i}`;
      params.push(filters.to);
      i++;
    }

    // ----- PAGINATION -----
    const limit = filters.limit ? parseInt(filters.limit, 10) : 9;
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;

    // ----- COUNT QUERY -----
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM blogs b
      ${where}
    `;

    const countResult = await pool.query(countSQL, params);
    const totalItems = parseInt(countResult.rows[0].total, 10) || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    // ----- MAIN QUERY -----
    const dataSQL = `
      SELECT 
        b.*,
        (SELECT COUNT(*) FROM blog_likes WHERE blog_id = b.id) AS "likeCount",
        COALESCE(json_build_object('id', p.id, 'name', p.name), null) AS place
      FROM blogs b
      LEFT JOIN places p ON b.place_id = p.id
      ${where}
      ORDER BY b.created_at DESC
      LIMIT $${i} OFFSET $${i + 1}
    `;

    const dataResult = await pool.query(dataSQL, [...params, limit, offset]);

    return {
      items: dataResult.rows,
      totalPages,
      currentPage: page,
      totalItems,
      itemsPerPage: limit
    };
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT b.*, 
              COALESCE(json_build_object('id', p.id, 'name', p.name), null) AS place
       FROM blogs b
       LEFT JOIN places p ON b.place_id = p.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async addTags(blogId, tagIds) {
    if (!tagIds.length) return [];
    const values = tagIds.map((_, idx) => `($1,$${idx + 2})`).join(',');
    const result = await pool.query(
      `INSERT INTO blog_tags (blog_id, tag_id)
       VALUES ${values} ON CONFLICT DO NOTHING RETURNING *`,
      [blogId, ...tagIds]
    );
    return result.rows;
  },

  async getTags(blogId) {
    const result = await pool.query(
      `SELECT t.id, t.name FROM tags t 
       INNER JOIN blog_tags bt ON bt.tag_id = t.id 
       WHERE bt.blog_id = $1`,
      [blogId]
    );
    return result.rows;
  },

  async addImages(blogId, urls) {
    if (!urls.length) return [];
    const values = urls.map((_, idx) => `($1,$${idx + 2},NOW())`).join(',');
    const result = await pool.query(
      `INSERT INTO blog_images (blog_id,image_url,created_at)
       VALUES ${values} RETURNING *`,
      [blogId, ...urls]
    );
    return result.rows;
  },

  async getImages(blogId) {
    const result = await pool.query(
      `SELECT * FROM blog_images WHERE blog_id=$1 ORDER BY id ASC`,
      [blogId]
    );
    return result.rows;
  },

  async getAttachments(blogId) {
    const result = await pool.query(
      `SELECT id, file_url, file_name, file_size, mime_type, created_at
       FROM blog_attachments
       WHERE blog_id = $1
       ORDER BY created_at DESC`,
      [blogId]
    );
    return result.rows;
  },

  async addAttachments(blogId, attachments) {
    if (!attachments.length) return [];
    const rows = attachments.map((_, idx) =>
      `($1,$${idx * 4 + 2},$${idx * 4 + 3},$${idx * 4 + 4},$${idx * 4 + 5},NOW())`
    ).join(',');

    const params = [blogId];
    attachments.forEach(att => {
      params.push(att.url, att.name, att.size, att.contentType);
    });

    const result = await pool.query(
      `INSERT INTO blog_attachments (blog_id,file_url,file_name,file_size,mime_type,created_at)
       VALUES ${rows} RETURNING *`,
      params
    );
    return result.rows;
  },

  async getAuthor(authorId) {
    const result = await pool.query(
      `SELECT id, display_name, email, first_name, last_name, department, job_title, avatar_url
       FROM users WHERE id = $1`,
      [authorId]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return {
        id: String(user.id),
        displayName:
          user.display_name ||
          `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
          'User',
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        jobTitle: user.job_title,
        avatarUrl: user.avatar_url,
        type: 'person'
      };
    }

    return {
      id: String(authorId),
      displayName: 'User',
      type: 'person'
    };
  },

  transformToJiveFormat(blog, tags, images, attachments, author, place) {
    const contentImages = images.map(img => ({
      id: String(img.id),
      ref: toAbsoluteUrl(img.image_url),
      name: img.image_url.split('/').pop()
    }));

    return {
      id: String(blog.id),
      subject: blog.title,
      content: { text: blog.content_html },
      published: new Date(blog.published_at).toISOString(),
      updated: new Date(blog.updated_at).toISOString(),
      author,
      tags: tags.map(t => t.name),
      likeCount: blog.likeCount || 0,
      followerCount: 0,
      viewCount: 0,
      attachments: attachments.map(a => ({
        id: String(a.id),
        name: a.file_name,
        url: toAbsoluteUrl(a.file_url),
        size: a.file_size,
        contentType: a.mime_type
      })),
      contentImages,
      parentPlace: place || { id: '6220', name: 'MFTBC', type: 'blog' },
      restrictReplies: blog.restricted_comments,
      type: 'post'
    };
  },

  async getLikeCount(blogId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = $1`,
      [blogId]
    );
    return parseInt(result.rows[0].count, 10) || 0;
  },

  async isLikedByUser(blogId, userId) {
    const result = await pool.query(
      `SELECT id FROM blog_likes WHERE blog_id = $1 AND user_id = $2`,
      [blogId, userId]
    );
    return result.rows.length > 0;
  },

  async toggleLike(blogId, userId) {
    const isLiked = await this.isLikedByUser(blogId, userId);

    if (isLiked) {
      await pool.query(
        `DELETE FROM blog_likes WHERE blog_id = $1 AND user_id = $2`,
        [blogId, userId]
      );
      return { liked: false };
    } else {
      await pool.query(
        `INSERT INTO blog_likes (blog_id, user_id, created_at) VALUES ($1, $2, NOW())`,
        [blogId, userId]
      );
      return { liked: true };
    }
  },

  async getLikes(blogId) {
    const result = await pool.query(
      `SELECT bl.*, u.display_name, u.email
       FROM blog_likes bl
       LEFT JOIN users u ON bl.user_id = u.id
       WHERE bl.blog_id = $1
       ORDER BY bl.created_at DESC`,
      [blogId]
    );
    return result.rows;
  },

  async getComments(blogId) {
    const result = await pool.query(
      `SELECT bc.*, u.display_name, u.email
       FROM blog_comments bc
       LEFT JOIN users u ON bc.user_id = u.id
       WHERE bc.blog_id = $1
       ORDER BY bc.created_at DESC`,
      [blogId]
    );
    return result.rows;
  },

  async addComment(blogId, userId, comment) {
    const result = await pool.query(
      `INSERT INTO blog_comments (blog_id, user_id, comment, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [blogId, userId, comment]
    );
    return result.rows[0];
  },

  async deleteComment(commentId, userId) {
    const result = await pool.query(
      `DELETE FROM blog_comments WHERE id = $1 AND user_id = $2 RETURNING *`,
      [commentId, userId]
    );
    return result.rows[0];
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE blogs SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    return { success: true };
  }
};

export default BlogModel;

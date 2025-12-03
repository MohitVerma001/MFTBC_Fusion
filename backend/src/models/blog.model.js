import pool from '../utils/db.js';

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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
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
    let query = `
      SELECT
        b.*,
        COALESCE(
          json_build_object('id', c.id, 'name', c.name, 'description', c.description, 'image_url', c.image_url),
          NULL
        ) as category,
        COALESCE(
          json_build_object('id', p.id, 'name', p.name, 'description', p.description),
          NULL
        ) as place,
        COALESCE(
          json_build_object('id', s.id, 'name', s.name, 'description', s.description),
          NULL
        ) as subspace
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN places p ON b.place_id = p.id
      LEFT JOIN subspaces s ON b.space_id = s.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (filters.publish_to) {
      query += ` AND b.publish_to = $${paramIndex}`;
      params.push(filters.publish_to);
      paramIndex++;
    }

    if (filters.publishTo) {
      query += ` AND b.publish_to = $${paramIndex}`;
      params.push(filters.publishTo);
      paramIndex++;
    }

    if (filters.category_id) {
      query += ` AND b.category_id = $${paramIndex}`;
      params.push(filters.category_id);
      paramIndex++;
    }

    if (filters.categoryId) {
      query += ` AND b.category_id = $${paramIndex}`;
      params.push(filters.categoryId);
      paramIndex++;
    }

    if (filters.space_id) {
      query += ` AND b.space_id = $${paramIndex}`;
      params.push(filters.space_id);
      paramIndex++;
    }

    if (filters.place_id) {
      query += ` AND b.place_id = $${paramIndex}`;
      params.push(filters.place_id);
      paramIndex++;
    }

    if (filters.placeId) {
      query += ` AND b.place_id = $${paramIndex}`;
      params.push(filters.placeId);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (b.title ILIKE $${paramIndex} OR b.content ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND b.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ` ORDER BY b.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT
        b.*,
        COALESCE(
          json_build_object('id', c.id, 'name', c.name, 'description', c.description, 'image_url', c.image_url),
          NULL
        ) as category,
        COALESCE(
          json_build_object('id', p.id, 'name', p.name, 'description', p.description),
          NULL
        ) as place,
        COALESCE(
          json_build_object('id', s.id, 'name', s.name, 'description', s.description),
          NULL
        ) as subspace
      FROM blogs b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN places p ON b.place_id = p.id
      LEFT JOIN subspaces s ON b.space_id = s.id
      WHERE b.id = $1`,
      [id]
    );

    return result.rows[0];
  },

  async update(id, blogData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(blogData).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(blogData[key]);
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
  },

  async addTags(blogId, tagIds) {
    if (!tagIds || tagIds.length === 0) return [];

    const values = tagIds.map((_, index) =>
      `($1, $${index + 2})`
    ).join(', ');

    const result = await pool.query(
      `INSERT INTO blog_tags (blog_id, tag_id)
       VALUES ${values}
       ON CONFLICT (blog_id, tag_id) DO NOTHING
       RETURNING *`,
      [blogId, ...tagIds]
    );

    return result.rows;
  },

  async getTags(blogId) {
    const result = await pool.query(
      `SELECT t.id, t.name, t.slug
       FROM tags t
       INNER JOIN blog_tags bt ON t.id = bt.tag_id
       WHERE bt.blog_id = $1`,
      [blogId]
    );

    return result.rows;
  },

  async removeTags(blogId) {
    await pool.query('DELETE FROM blog_tags WHERE blog_id = $1', [blogId]);
    return { success: true };
  },

  async addImages(blogId, imageUrls) {
    if (!imageUrls || imageUrls.length === 0) return [];

    const values = imageUrls.map((_, index) =>
      `($1, $${index + 2}, NOW())`
    ).join(', ');

    const result = await pool.query(
      `INSERT INTO blog_images (blog_id, image_url, created_at) VALUES ${values} RETURNING *`,
      [blogId, ...imageUrls]
    );

    return result.rows;
  },

  async getImages(blogId) {
    const result = await pool.query(
      'SELECT * FROM blog_images WHERE blog_id = $1 ORDER BY display_order, created_at',
      [blogId]
    );

    return result.rows;
  },

  async addAttachments(blogId, attachments) {
    if (!attachments || attachments.length === 0) return [];

    const values = attachments.map((_, index) => {
      const base = index * 4;
      return `($1, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, NOW())`;
    }).join(', ');

    const params = [blogId];
    attachments.forEach(att => {
      params.push(att.url || att.file_url, att.filename || att.file_name, att.size || att.file_size || 0, att.mimeType || att.mime_type || 'application/octet-stream');
    });

    const result = await pool.query(
      `INSERT INTO blog_attachments (blog_id, file_url, file_name, file_size, mime_type, created_at)
       VALUES ${values} RETURNING *`,
      params
    );

    return result.rows;
  },

  async getAttachments(blogId) {
    const result = await pool.query(
      'SELECT * FROM blog_attachments WHERE blog_id = $1',
      [blogId]
    );

    return result.rows;
  }
};

export default BlogModel;

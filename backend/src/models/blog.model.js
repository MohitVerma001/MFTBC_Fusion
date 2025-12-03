import pool from '../../database.js';

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
        content,
        content_html,
        publish_to,
        category_id,
        space_id,
        place_id,
        restricted_comments || false,
        is_place_blog || false,
        author_id,
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
        json_build_object('id', c.id, 'name', c.name, 'description', c.description) as category,
        json_build_object('id', p.id, 'name', p.name) as place,
        json_build_object('id', s.id, 'name', s.name) as subspace
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

    if (filters.category_id) {
      query += ` AND b.category_id = $${paramIndex}`;
      params.push(filters.category_id);
      paramIndex++;
    }

    if (filters.space_id) {
      query += ` AND b.space_id = $${paramIndex}`;
      params.push(filters.space_id);
      paramIndex++;
    }

    if (filters.is_published !== undefined) {
      query += ` AND b.status = $${paramIndex}`;
      params.push(filters.is_published ? 'published' : 'draft');
      paramIndex++;
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT
        b.*,
        json_build_object('id', c.id, 'name', c.name, 'description', c.description, 'image_url', c.image_url) as category,
        json_build_object('id', p.id, 'name', p.name, 'description', p.description) as place,
        json_build_object('id', s.id, 'name', s.name, 'description', s.description) as subspace
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
      fields.push(`${key} = $${paramIndex}`);
      values.push(blogData[key]);
      paramIndex++;
    });

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
    const values = tagIds.map((tagId, index) =>
      `($1, $${index + 2})`
    ).join(', ');

    const result = await pool.query(
      `INSERT INTO blog_tags (blog_id, tag_id) VALUES ${values} RETURNING *`,
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

  async addImages(blogId, imageUrls) {
    const values = imageUrls.map((url, index) =>
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
      'SELECT * FROM blog_images WHERE blog_id = $1',
      [blogId]
    );

    return result.rows;
  },

  async addAttachments(blogId, attachments) {
    const values = attachments.map((_, index) => {
      const base = index * 4;
      return `($1, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, NOW())`;
    }).join(', ');

    const params = [blogId];
    attachments.forEach(att => {
      params.push(att.url, att.filename, att.size, att.mimeType);
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

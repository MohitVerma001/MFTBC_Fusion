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
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
      RETURNING *`,
      [
        title,
        content || "",
        content_html || content || "",
        publish_to,
        category_id || null,
        space_id || 6220,      // DEFAULT MFTBC SPACE
        place_id || null,
        restricted_comments || false,
        is_place_blog || false,
        author_id || 1,
        status || "published",
        published_at || new Date()
      ]
    );

    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT b.*, 
             COALESCE(json_build_object('id', p.id, 'name', p.name), null) AS place
      FROM blogs b
      LEFT JOIN places p ON b.place_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let i = 1;

    if (filters.publishTo) {
      query += ` AND b.publish_to = $${i}`;
      params.push(filters.publishTo);
      i++;
    }

    if (filters.categoryId) {
      query += ` AND b.category_id = $${i}`;
      params.push(filters.categoryId);
      i++;
    }

    if (filters.placeId) {
      query += ` AND b.place_id = $${i}`;
      params.push(filters.placeId);
      i++;
    }

    if (filters.search) {
      query += ` AND (b.title ILIKE $${i} OR b.content ILIKE $${i})`;
      params.push(`%${filters.search}%`);
      i++;
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
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
    const values = tagIds.map((_, idx) => `($1,$${idx + 2})`).join(",");
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
    const values = urls.map((_, idx) => `($1,$${idx + 2},NOW())`).join(",");
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

  // ✅ FIX: ADD THIS FUNCTION (Missing Earlier)
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
    ).join(",");

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
    return {
      id: String(authorId),
      displayName: "User",
      type: "person"
    };
  },

  transformToJiveFormat(blog, tags, images, attachments, author, place) {
    const contentImages = images.map(img => ({
      id: String(img.id),
      ref: img.image_url,
      name: img.image_url.split("/").pop()
    }));

    return {
      id: String(blog.id),
      subject: blog.title,
      content: { text: blog.content_html },
      published: new Date(blog.published_at).toISOString(),
      updated: new Date(blog.updated_at).toISOString(),
      author,
      tags: tags.map(t => t.name),
      likeCount: 0,
      followerCount: 0,
      viewCount: 0,
      attachments: attachments.map(a => ({
        id: String(a.id),
        name: a.file_name,
        url: a.file_url,
        size: a.file_size,
        contentType: a.mime_type
      })),
      contentImages,
      parentPlace: place || { id: "6220", name: "MFTBC", type: "blog" },
      restrictReplies: blog.restricted_comments,
      type: "post"
    };
  }
};

export default BlogModel;

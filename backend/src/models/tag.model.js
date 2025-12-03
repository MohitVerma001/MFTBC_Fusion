import pool from '../utils/db.js';

export const TagModel = {
  async create(tagData) {
    const { name } = tagData;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const result = await pool.query(
      `INSERT INTO tags (name, slug, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [name, slug]
    );

    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM tags WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.search) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM tags WHERE id = $1',
      [id]
    );

    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query(
      'SELECT * FROM tags WHERE name = $1',
      [name]
    );

    return result.rows[0];
  },

  async findOrCreate(name) {
    let tag = await this.findByName(name);
    if (!tag) {
      tag = await this.create({ name });
    }
    return tag;
  },

  async update(id, tagData) {
    const { name } = tagData;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const result = await pool.query(
      `UPDATE tags SET name = $1, slug = $2 WHERE id = $3 RETURNING *`,
      [name, slug, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM tags WHERE id = $1', [id]);
    return { success: true };
  }
};

export default TagModel;

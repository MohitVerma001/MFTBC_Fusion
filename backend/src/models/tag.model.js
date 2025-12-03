import pool from '../../database.js';

export const TagModel = {
  async create(tagData) {
    const { name } = tagData;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const result = await pool.query(
      `INSERT INTO tags (name, slug, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (name) DO NOTHING
       RETURNING *`,
      [name, slug]
    );

    if (result.rows.length === 0) {
      return await this.findByName(name);
    }

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

  async update(id, tagData) {
    const { name } = tagData;

    const result = await pool.query(
      `UPDATE tags SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM tags WHERE id = $1', [id]);
    return { success: true };
  }
};

export default TagModel;

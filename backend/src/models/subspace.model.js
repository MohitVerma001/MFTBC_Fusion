import pool from '../utils/db.js';

export const SubspaceModel = {
  async create(subspaceData) {
    const {
      name,
      description,
      content_html,
      image_url,
      is_published
    } = subspaceData;

    const result = await pool.query(
      `INSERT INTO subspaces (
        name, description, content_html, image_url, is_published,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *`,
      [
        name,
        description || '',
        content_html || '',
        image_url || null,
        is_published !== undefined ? is_published : true
      ]
    );

    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM subspaces WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.is_published !== undefined) {
      query += ` AND is_published = $${paramIndex}`;
      params.push(filters.is_published);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM subspaces WHERE id = $1',
      [id]
    );

    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query(
      'SELECT * FROM subspaces WHERE name = $1',
      [name]
    );

    return result.rows[0];
  },

  async update(id, subspaceData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(subspaceData).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(subspaceData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE subspaces SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM subspaces WHERE id = $1', [id]);
    return { success: true };
  }
};

export default SubspaceModel;

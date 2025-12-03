import pool from '../../database.js';

export const PlaceModel = {
  async create(placeData) {
    const { name, description, type } = placeData;

    const result = await pool.query(
      `INSERT INTO places (name, description, type, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [name, description, type]
    );

    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM places WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM places WHERE id = $1',
      [id]
    );

    return result.rows[0];
  },

  async update(id, placeData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(placeData).forEach(key => {
      fields.push(`${key} = $${paramIndex}`);
      values.push(placeData[key]);
      paramIndex++;
    });

    values.push(id);

    const result = await pool.query(
      `UPDATE places SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM places WHERE id = $1', [id]);
    return { success: true };
  }
};

export default PlaceModel;

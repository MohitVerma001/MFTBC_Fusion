import pool from '../utils/db.js';

export const SpacesModel = {
  async findAll() {
    const result = await pool.query(
      `SELECT id, business_key, language, name, description, is_active, created_at, updated_at
       FROM spaces
       WHERE is_active = true
       ORDER BY business_key, language`
    );
    return result.rows;
  },

  async findByBusinessKeyAndLanguage(businessKey, language) {
    const result = await pool.query(
      `SELECT id, business_key, language, name, description, is_active, created_at, updated_at
       FROM spaces
       WHERE business_key = $1 AND language = $2 AND is_active = true`,
      [businessKey, language]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, business_key, language, name, description, is_active, created_at, updated_at
       FROM spaces
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async getBusinessKeys() {
    const result = await pool.query(
      `SELECT DISTINCT business_key
       FROM spaces
       WHERE is_active = true
       ORDER BY business_key`
    );
    return result.rows.map(row => row.business_key);
  },

  async getLanguages() {
    const result = await pool.query(
      `SELECT DISTINCT language
       FROM spaces
       WHERE is_active = true
       ORDER BY language`
    );
    return result.rows.map(row => row.language);
  }
};

export default SpacesModel;

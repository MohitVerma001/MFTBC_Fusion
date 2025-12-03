import pool from '../utils/db.js';

export const CategoryModel = {
  async create(categoryData) {
    const {
      type,
      name,
      description,
      image_url,
      link_url,
      link_icon_url,
      is_published,
      parent_category,
      created_by
    } = categoryData;

    const result = await pool.query(
      `INSERT INTO categories (
        type, name, description, image_url, link_url, link_icon_url,
        is_published, parent_category, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *`,
      [
        type || 'Category',
        name,
        description || '',
        image_url || null,
        link_url || null,
        link_icon_url || null,
        is_published !== undefined ? is_published : true,
        parent_category || null,
        created_by || 1
      ]
    );

    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM categories WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters.parent_category !== undefined) {
      if (filters.parent_category === null) {
        query += ' AND parent_category IS NULL';
      } else {
        query += ` AND parent_category = $${paramIndex}`;
        params.push(filters.parent_category);
        paramIndex++;
      }
    }

    if (filters.is_published !== undefined) {
      query += ` AND is_published = $${paramIndex}`;
      params.push(filters.is_published);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE name = $1',
      [name]
    );

    return result.rows[0];
  },

  async update(id, categoryData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(categoryData).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(categoryData[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    return { success: true };
  }
};

export default CategoryModel;

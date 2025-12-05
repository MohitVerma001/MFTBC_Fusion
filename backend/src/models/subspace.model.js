import pool from '../utils/db.js';

export const SubspaceModel = {
  // Ensure default parent space "MFTBC" exists and return it
  async ensureDefaultMFTBC() {
    const name = 'MFTBC';

    // Try to find existing
    const existing = await pool.query(
      'SELECT * FROM subspaces WHERE name = $1 LIMIT 1',
      [name]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // Create default parent subspace
    const result = await pool.query(
      `INSERT INTO subspaces (
        name, description, content_html, image_url,
        is_published, parent_subspace_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [
        name,
        'Default parent space for all MFTBC content',
        '',
        null,
        true,
        null
      ]
    );

    return result.rows[0];
  },

  async create(subspaceData) {
    const {
      name,
      description,
      content_html,
      image_url,
      is_published,
      parent_space_id,
      language,
      visibility,
      scheduled_at,
      created_by,
      navigation_items,
      display_order,
      is_root_space
    } = subspaceData;

    const navItems = Array.isArray(navigation_items) ? navigation_items : ["News", "HR", "Activity", "Content", "IT", "People", "Spaces", "Calendar", "CEO Message"];

    const result = await pool.query(
      `INSERT INTO subspaces (
        name, description, content_html, image_url,
        is_published, parent_space_id, language,
        visibility, scheduled_at, created_by,
        navigation_items, display_order, is_root_space
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13)
      RETURNING *`,
      [
        name,
        description || '',
        content_html || '',
        image_url || null,
        is_published !== undefined ? is_published : true,
        parent_space_id || null,
        language || 'en',
        visibility || 'public',
        scheduled_at || null,
        created_by || null,
        JSON.stringify(navItems),
        display_order || 0,
        is_root_space || false
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

    if (filters.parent_space_id !== undefined) {
      if (filters.parent_space_id === null || filters.parent_space_id === 'null') {
        query += ` AND parent_space_id IS NULL`;
      } else {
        query += ` AND parent_space_id = $${paramIndex}`;
        params.push(filters.parent_space_id);
        paramIndex++;
      }
    }

    if (filters.is_root_space !== undefined) {
      query += ` AND is_root_space = $${paramIndex}`;
      params.push(filters.is_root_space);
      paramIndex++;
    }

    if (filters.created_by) {
      query += ` AND created_by = $${paramIndex}`;
      params.push(filters.created_by);
      paramIndex++;
    }

    if (filters.visibility) {
      query += ` AND visibility = $${paramIndex}`;
      params.push(filters.visibility);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getRootSpaces() {
    const result = await pool.query(
      'SELECT * FROM subspaces WHERE is_root_space = true OR parent_space_id IS NULL ORDER BY display_order ASC, created_at ASC'
    );
    return result.rows;
  },

  async getChildSpaces(parentId) {
    const result = await pool.query(
      'SELECT * FROM subspaces WHERE parent_space_id = $1 ORDER BY display_order ASC, created_at DESC',
      [parentId]
    );
    return result.rows;
  },

  async getSpaceHierarchy(spaceId) {
    const result = await pool.query(
      `WITH RECURSIVE space_tree AS (
        SELECT *, 0 as level FROM subspaces WHERE id = $1
        UNION ALL
        SELECT s.*, st.level + 1
        FROM subspaces s
        INNER JOIN space_tree st ON s.parent_space_id = st.id
      )
      SELECT * FROM space_tree ORDER BY level, display_order, created_at`,
      [spaceId]
    );
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
        let value = subspaceData[key];

        if (key === 'navigation_items' && Array.isArray(value)) {
          value = JSON.stringify(value);
          fields.push(`${key} = $${paramIndex}::jsonb`);
        } else {
          fields.push(`${key} = $${paramIndex}`);
        }

        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE subspaces SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
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

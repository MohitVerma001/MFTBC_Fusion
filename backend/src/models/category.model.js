import { supabase } from '../../database.js';

export const CategoryModel = {
  async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll(filters = {}) {
    let query = supabase
      .from('categories')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.parent_category) {
      query = query.eq('parent_category', filters.parent_category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...categoryData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export default CategoryModel;

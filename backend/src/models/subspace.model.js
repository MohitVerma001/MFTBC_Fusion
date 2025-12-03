import { supabase } from '../../database.js';

export const SubspaceModel = {
  async create(subspaceData) {
    const { data, error } = await supabase
      .from('subspaces')
      .insert([subspaceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll(filters = {}) {
    let query = supabase
      .from('subspaces')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.is_published !== undefined) {
      query = query.eq('is_published', filters.is_published);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('subspaces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, subspaceData) {
    const { data, error } = await supabase
      .from('subspaces')
      .update({ ...subspaceData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('subspaces')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export default SubspaceModel;

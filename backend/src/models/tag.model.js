import { supabase } from '../../database.js';

export const TagModel = {
  async create(tagData) {
    const slug = tagData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const { data, error } = await supabase
      .from('tags')
      .insert([{ ...tagData, slug }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return await this.findByName(tagData.name);
      }
      throw error;
    }
    return data;
  },

  async findAll(filters = {}) {
    let query = supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async findByName(name) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id, tagData) {
    const { data, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export default TagModel;

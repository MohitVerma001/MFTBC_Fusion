import { supabase } from '../../database.js';

export const PlaceModel = {
  async create(placeData) {
    const { data, error } = await supabase
      .from('places')
      .insert([placeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll(filters = {}) {
    let query = supabase
      .from('places')
      .select('*')
      .order('name', { ascending: true });

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, placeData) {
    const { data, error } = await supabase
      .from('places')
      .update(placeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export default PlaceModel;

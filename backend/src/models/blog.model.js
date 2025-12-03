import { supabase } from '../../database.js';

export const BlogModel = {
  async create(blogData) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blogData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findAll(filters = {}) {
    let query = supabase
      .from('blogs')
      .select(`
        *,
        category:categories(id, name, description),
        place:places(id, name),
        subspace:subspaces(id, name)
      `)
      .order('created_at', { ascending: false });

    if (filters.publish_to) {
      query = query.eq('publish_to', filters.publish_to);
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.space_id) {
      query = query.eq('space_id', filters.space_id);
    }

    if (filters.is_published !== undefined) {
      query = query.eq('status', filters.is_published ? 'published' : 'draft');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:categories(id, name, description, image_url),
        place:places(id, name, description),
        subspace:subspaces(id, name, description)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, blogData) {
    const { data, error } = await supabase
      .from('blogs')
      .update({ ...blogData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async addTags(blogId, tagIds) {
    const blogTags = tagIds.map(tagId => ({
      blog_id: blogId,
      tag_id: tagId
    }));

    const { data, error } = await supabase
      .from('blog_tags')
      .insert(blogTags)
      .select();

    if (error) throw error;
    return data;
  },

  async getTags(blogId) {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('tag:tags(id, name, slug)')
      .eq('blog_id', blogId);

    if (error) throw error;
    return data.map(item => item.tag);
  },

  async addImages(blogId, imageUrls) {
    const images = imageUrls.map(url => ({
      blog_id: blogId,
      image_url: url
    }));

    const { data, error } = await supabase
      .from('blog_images')
      .insert(images)
      .select();

    if (error) throw error;
    return data;
  },

  async getImages(blogId) {
    const { data, error } = await supabase
      .from('blog_images')
      .select('*')
      .eq('blog_id', blogId);

    if (error) throw error;
    return data;
  },

  async addAttachments(blogId, attachments) {
    const attachmentRecords = attachments.map(att => ({
      blog_id: blogId,
      file_url: att.url,
      file_name: att.filename,
      file_size: att.size,
      mime_type: att.mimeType
    }));

    const { data, error } = await supabase
      .from('blog_attachments')
      .insert(attachmentRecords)
      .select();

    if (error) throw error;
    return data;
  },

  async getAttachments(blogId) {
    const { data, error } = await supabase
      .from('blog_attachments')
      .select('*')
      .eq('blog_id', blogId);

    if (error) throw error;
    return data;
  }
};

export default BlogModel;

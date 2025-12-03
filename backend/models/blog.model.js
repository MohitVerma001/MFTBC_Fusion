import supabase from '../config/database.js';

class BlogModel {
  static async create(blogData) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title: blogData.title,
        content: blogData.content,
        publish_to: blogData.publishTo,
        category_id: blogData.categoryId || null,
        place_id: blogData.placeId || null,
        restricted_comments: blogData.restrictedComments || false,
        is_place_blog: blogData.isPlaceBlog || false,
        author_id: blogData.authorId,
        status: blogData.status || 'published',
        published_at: blogData.publishedAt || new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        category:categories(*),
        place:places(*),
        author:author_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getAll(filters = {}) {
    let query = supabase
      .from('blogs')
      .select(`
        *,
        category:categories(*),
        place:places(*),
        blog_tags(tag:tags(*))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (filters.publishTo) {
      query = query.eq('publish_to', filters.publishTo);
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('blogs')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async addTags(blogId, tagIds) {
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
  }

  static async addImages(blogId, images) {
    const imageRecords = images.map(img => ({
      blog_id: blogId,
      url: img.url,
      filename: img.filename,
      size: img.size
    }));

    const { data, error } = await supabase
      .from('images')
      .insert(imageRecords)
      .select();

    if (error) throw error;
    return data;
  }

  static async addAttachments(blogId, attachments) {
    const attachmentRecords = attachments.map(att => ({
      blog_id: blogId,
      url: att.url,
      filename: att.filename,
      size: att.size,
      mime_type: att.mimeType
    }));

    const { data, error } = await supabase
      .from('attachments')
      .insert(attachmentRecords)
      .select();

    if (error) throw error;
    return data;
  }

  static async getBlogTags(blogId) {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('tag:tags(*)')
      .eq('blog_id', blogId);

    if (error) throw error;
    return data.map(item => item.tag);
  }

  static async getBlogImages(blogId) {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('blog_id', blogId);

    if (error) throw error;
    return data;
  }

  static async getBlogAttachments(blogId) {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('blog_id', blogId);

    if (error) throw error;
    return data;
  }
}

export default BlogModel;

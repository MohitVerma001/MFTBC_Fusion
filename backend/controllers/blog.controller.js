import BlogModel from '../models/blog.model.js';
import supabase from '../config/database.js';

class BlogController {
  static async createBlog(req, res) {
    try {
      const {
        title,
        content,
        publishTo,
        categoryId,
        placeId,
        restrictedComments,
        isPlaceBlog,
        tagIds,
        authorId
      } = req.body;

      if (!title || !content || !publishTo || !authorId) {
        return res.status(400).json({
          success: false,
          message: 'Title, content, publishTo, and authorId are required'
        });
      }

      const blog = await BlogModel.create({
        title,
        content,
        publishTo,
        categoryId,
        placeId,
        restrictedComments: restrictedComments === 'true' || restrictedComments === true,
        isPlaceBlog: isPlaceBlog === 'true' || isPlaceBlog === true,
        authorId
      });

      if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
        await BlogModel.addTags(blog.id, tagIds);
      }

      const images = [];
      if (req.files && req.files.images) {
        for (const file of req.files.images) {
          images.push({
            url: `/uploads/images/${file.filename}`,
            filename: file.originalname,
            size: file.size
          });
        }
        await BlogModel.addImages(blog.id, images);
      }

      const attachments = [];
      if (req.files && req.files.attachments) {
        for (const file of req.files.attachments) {
          attachments.push({
            url: `/uploads/attachments/${file.filename}`,
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype
          });
        }
        await BlogModel.addAttachments(blog.id, attachments);
      }

      const blogTags = await BlogModel.getBlogTags(blog.id);
      const blogImages = await BlogModel.getBlogImages(blog.id);
      const blogAttachments = await BlogModel.getBlogAttachments(blog.id);

      return res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: {
          ...blog,
          tags: blogTags,
          images: blogImages,
          attachments: blogAttachments
        }
      });

    } catch (error) {
      console.error('Error creating blog:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create blog',
        error: error.message
      });
    }
  }

  static async getBlogById(req, res) {
    try {
      const { id } = req.params;

      const blog = await BlogModel.getById(id);
      const tags = await BlogModel.getBlogTags(id);
      const images = await BlogModel.getBlogImages(id);
      const attachments = await BlogModel.getBlogAttachments(id);

      return res.status(200).json({
        success: true,
        data: {
          ...blog,
          tags,
          images,
          attachments
        }
      });

    } catch (error) {
      console.error('Error fetching blog:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch blog',
        error: error.message
      });
    }
  }

  static async getAllBlogs(req, res) {
    try {
      const { publishTo, categoryId } = req.query;

      const blogs = await BlogModel.getAll({
        publishTo,
        categoryId
      });

      for (const blog of blogs) {
        blog.images = await BlogModel.getBlogImages(blog.id);
        blog.attachments = await BlogModel.getBlogAttachments(blog.id);
      }

      return res.status(200).json({
        success: true,
        data: blogs
      });

    } catch (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch blogs',
        error: error.message
      });
    }
  }

  static async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const blog = await BlogModel.update(id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        data: blog
      });

    } catch (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update blog',
        error: error.message
      });
    }
  }

  static async deleteBlog(req, res) {
    try {
      const { id } = req.params;

      await BlogModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Blog deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete blog',
        error: error.message
      });
    }
  }

  static async getCategories(req, res) {
    try {
      const { parentCategory } = req.query;

      let query = supabase
        .from('categories')
        .select('*')
        .order('name');

      if (parentCategory) {
        query = query.eq('parent_category', parentCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data
      });

    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  }

  static async getTags(req, res) {
    try {
      const { search } = req.query;

      let query = supabase
        .from('tags')
        .select('*')
        .order('name');

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data
      });

    } catch (error) {
      console.error('Error fetching tags:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tags',
        error: error.message
      });
    }
  }

  static async createTag(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Tag name is required'
        });
      }

      const slug = name.toLowerCase().replace(/\s+/g, '-');

      const { data, error } = await supabase
        .from('tags')
        .insert([{ name, slug }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({
            success: false,
            message: 'Tag already exists'
          });
        }
        throw error;
      }

      return res.status(201).json({
        success: true,
        message: 'Tag created successfully',
        data
      });

    } catch (error) {
      console.error('Error creating tag:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create tag',
        error: error.message
      });
    }
  }

  static async getPlaces(req, res) {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('name');

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data
      });

    } catch (error) {
      console.error('Error fetching places:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch places',
        error: error.message
      });
    }
  }
}

export default BlogController;

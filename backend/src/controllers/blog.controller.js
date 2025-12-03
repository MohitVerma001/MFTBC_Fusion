import { BlogModel } from '../models/blog.model.js';
import { TagModel } from '../models/tag.model.js';

export const BlogController = {
  async createBlog(req, res) {
    try {
      const {
        title,
        content,
        publish_to,
        category_id,
        space_id,
        place_id,
        restricted_comments,
        is_place_blog,
        author_id,
        tag_ids,
        image_urls,
        attachments
      } = req.body;

      if (!title || !content || !publish_to) {
        return res.status(400).json({
          success: false,
          message: 'Title, content, and publish_to are required'
        });
      }

      if (publish_to === 'HR' && !category_id) {
        return res.status(400).json({
          success: false,
          message: 'Category is required when publishing to HR'
        });
      }

      const blogData = {
        title,
        content,
        content_html: content,
        publish_to,
        category_id: publish_to === 'HR' ? category_id : null,
        space_id: space_id || null,
        place_id: place_id || null,
        restricted_comments: restricted_comments || false,
        is_place_blog: is_place_blog || false,
        author_id: author_id || null,
        status: 'published',
        published_at: new Date().toISOString()
      };

      const blog = await BlogModel.create(blogData);

      if (tag_ids && tag_ids.length > 0) {
        await BlogModel.addTags(blog.id, tag_ids);
      }

      if (image_urls && image_urls.length > 0) {
        await BlogModel.addImages(blog.id, image_urls);
      }

      if (attachments && attachments.length > 0) {
        await BlogModel.addAttachments(blog.id, attachments);
      }

      const tags = tag_ids ? await BlogModel.getTags(blog.id) : [];
      const images = image_urls ? await BlogModel.getImages(blog.id) : [];
      const blogAttachments = attachments ? await BlogModel.getAttachments(blog.id) : [];

      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: {
          ...blog,
          tags,
          images,
          attachments: blogAttachments
        }
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create blog',
        error: error.message
      });
    }
  },

  async getAllBlogs(req, res) {
    try {
      const { publish_to, category_id, space_id, is_published } = req.query;

      const filters = {};
      if (publish_to) filters.publish_to = publish_to;
      if (category_id) filters.category_id = category_id;
      if (space_id) filters.space_id = space_id;
      if (is_published !== undefined) filters.is_published = is_published === 'true';

      const blogs = await BlogModel.findAll(filters);

      const blogsWithRelations = await Promise.all(
        blogs.map(async (blog) => {
          const tags = await BlogModel.getTags(blog.id);
          const images = await BlogModel.getImages(blog.id);
          const attachments = await BlogModel.getAttachments(blog.id);

          return {
            ...blog,
            tags,
            images,
            attachments
          };
        })
      );

      res.status(200).json({
        success: true,
        data: blogsWithRelations
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blogs',
        error: error.message
      });
    }
  },

  async getBlogById(req, res) {
    try {
      const { id } = req.params;

      const blog = await BlogModel.findById(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      const tags = await BlogModel.getTags(blog.id);
      const images = await BlogModel.getImages(blog.id);
      const attachments = await BlogModel.getAttachments(blog.id);

      res.status(200).json({
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
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blog',
        error: error.message
      });
    }
  },

  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.publish_to === 'HR' && !updateData.category_id) {
        return res.status(400).json({
          success: false,
          message: 'Category is required when publishing to HR'
        });
      }

      if (updateData.publish_to && updateData.publish_to !== 'HR') {
        updateData.category_id = null;
      }

      const blog = await BlogModel.update(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        data: blog
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update blog',
        error: error.message
      });
    }
  },

  async deleteBlog(req, res) {
    try {
      const { id } = req.params;

      await BlogModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Blog deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete blog',
        error: error.message
      });
    }
  }
};

export default BlogController;

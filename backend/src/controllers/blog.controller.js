import { BlogModel } from '../models/blog.model.js';
import { TagModel } from '../models/tag.model.js';

export const BlogController = {
  async createBlog(req, res) {
    try {
      const {
        title,
        content,
        contentHtml,
        content_html,
        publishTo,
        publish_to,
        categoryId,
        category_id,
        spaceId,
        space_id,
        placeId,
        place_id,
        restrictedComments,
        restricted_comments,
        isPlaceBlog,
        is_place_blog,
        authorId,
        author_id,
        tagIds,
        tag_ids,
        tags,
        imageUrls,
        image_urls,
        images,
        attachments
      } = req.body;

      const finalPublishTo = publishTo || publish_to;
      const finalTitle = title;
      const finalContent = content;
      const finalContentHtml = contentHtml || content_html || content;

      if (!finalTitle || !finalContent || !finalPublishTo) {
        return res.status(400).json({
          success: false,
          message: 'Title, content, and publishTo are required'
        });
      }

      if (finalPublishTo === 'HR' && !(categoryId || category_id)) {
        return res.status(400).json({
          success: false,
          message: 'Category is required when publishing to HR'
        });
      }

      const blogData = {
        title: finalTitle,
        content: finalContent,
        content_html: finalContentHtml,
        publish_to: finalPublishTo,
        category_id: (categoryId || category_id) || null,
        space_id: (spaceId || space_id) || null,
        place_id: (placeId || place_id) || null,
        restricted_comments: (restrictedComments || restricted_comments) || false,
        is_place_blog: (isPlaceBlog || is_place_blog) || false,
        author_id: (authorId || author_id) || 1,
        status: 'published',
        published_at: new Date()
      };

      const blog = await BlogModel.create(blogData);

      const finalTagIds = tagIds || tag_ids || [];
      if (tags && Array.isArray(tags)) {
        for (const tagName of tags) {
          const tag = await TagModel.findOrCreate(tagName);
          finalTagIds.push(tag.id);
        }
      }

      if (finalTagIds && finalTagIds.length > 0) {
        await BlogModel.addTags(blog.id, finalTagIds);
      }

      const finalImageUrls = imageUrls || image_urls || images || [];
      if (finalImageUrls && finalImageUrls.length > 0) {
        await BlogModel.addImages(blog.id, finalImageUrls);
      }

      if (attachments && attachments.length > 0) {
        await BlogModel.addAttachments(blog.id, attachments);
      }

      const blogTags = finalTagIds.length > 0 ? await BlogModel.getTags(blog.id) : [];
      const blogImages = finalImageUrls.length > 0 ? await BlogModel.getImages(blog.id) : [];
      const blogAttachments = attachments ? await BlogModel.getAttachments(blog.id) : [];

      res.status(201).json({
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
      res.status(500).json({
        success: false,
        message: 'Failed to create blog',
        error: error.message
      });
    }
  },

  async getAllBlogs(req, res) {
    try {
      const {
        publishTo,
        publish_to,
        categoryId,
        category_id,
        spaceId,
        space_id,
        placeId,
        place_id,
        search,
        limit,
        status
      } = req.query;

      const filters = {};
      if (publishTo || publish_to) filters.publishTo = publishTo || publish_to;
      if (categoryId || category_id) filters.categoryId = categoryId || category_id;
      if (spaceId || space_id) filters.space_id = spaceId || space_id;
      if (placeId || place_id) filters.placeId = placeId || place_id;
      if (search) filters.search = search;
      if (limit) filters.limit = parseInt(limit);
      if (status) filters.status = status;

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
      const updateData = { ...req.body };

      const finalPublishTo = updateData.publishTo || updateData.publish_to;
      if (finalPublishTo) {
        updateData.publish_to = finalPublishTo;
        delete updateData.publishTo;
      }

      const finalCategoryId = updateData.categoryId || updateData.category_id;
      if (finalPublishTo === 'HR' && !finalCategoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category is required when publishing to HR'
        });
      }

      if (finalPublishTo && finalPublishTo !== 'HR') {
        updateData.category_id = null;
      } else if (finalCategoryId) {
        updateData.category_id = finalCategoryId;
      }

      if (updateData.categoryId) delete updateData.categoryId;
      if (updateData.placeId) {
        updateData.place_id = updateData.placeId;
        delete updateData.placeId;
      }
      if (updateData.spaceId) {
        updateData.space_id = updateData.spaceId;
        delete updateData.spaceId;
      }

      const blog = await BlogModel.update(id, updateData);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

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

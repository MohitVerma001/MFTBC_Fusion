import { BlogModel } from '../models/blog.model.js';
import { TagModel } from '../models/tag.model.js';

export const BlogController = {
  async createBlog(req, res) {
    try {
      const {
        title,
        subject,
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
        restrictReplies,
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
        contentImages,
        attachments
      } = req.body;

      const finalPublishTo = publishTo || publish_to;
      const finalTitle = subject || title;
      const finalContent = content;
      const finalContentHtml = contentHtml || content_html || content;

      if (!finalTitle || !finalContent || !finalPublishTo) {
        return res.status(400).json({
          success: false,
          message: 'Title/subject, content, and publishTo are required'
        });
      }

      if (finalPublishTo === 'HR' && !(categoryId || category_id)) {
        return res.status(400).json({
          success: false,
          message: 'Category is required when publishing to HR'
        });
      }

      const finalRestrictedComments = restrictReplies || restrictedComments || restricted_comments || false;

      const blogData = {
        title: finalTitle,
        content: finalContent,
        content_html: finalContentHtml,
        publish_to: finalPublishTo,
        category_id: (categoryId || category_id) || null,
        space_id: (spaceId || space_id) || null,
        place_id: (placeId || place_id) || null,
        restricted_comments: finalRestrictedComments,
        is_place_blog: (isPlaceBlog || is_place_blog) || false,
        author_id: (authorId || author_id) || 1,
        status: 'published',
        published_at: new Date()
      };

      const blog = await BlogModel.create(blogData);

      const finalTagIds = tagIds || tag_ids || [];
      if (tags && Array.isArray(tags)) {
        for (const tagName of tags) {
          if (typeof tagName === 'string') {
            const tag = await TagModel.findOrCreate(tagName);
            finalTagIds.push(tag.id);
          }
        }
      }

      if (finalTagIds && finalTagIds.length > 0) {
        await BlogModel.addTags(blog.id, finalTagIds);
      }

      const finalImageUrls = contentImages || imageUrls || image_urls || images || [];
      if (finalImageUrls && finalImageUrls.length > 0) {
        const imageUrlsToSave = finalImageUrls.map(img => {
          if (typeof img === 'string') return img;
          if (img.ref) return img.ref;
          if (img.url) return img.url;
          return null;
        }).filter(Boolean);

        if (imageUrlsToSave.length > 0) {
          await BlogModel.addImages(blog.id, imageUrlsToSave);
        }
      }

      if (attachments && attachments.length > 0) {
        const attachmentsToSave = attachments.map(att => ({
          url: att.url || att.file_url || att.ref,
          filename: att.name || att.filename || att.file_name || 'file',
          size: att.size || att.file_size || 0,
          mimeType: att.contentType || att.mimeType || att.mime_type || 'application/octet-stream'
        })).filter(att => att.url);

        if (attachmentsToSave.length > 0) {
          await BlogModel.addAttachments(blog.id, attachmentsToSave);
        }
      }

      const blogTags = await BlogModel.getTags(blog.id);
      const blogImages = await BlogModel.getImages(blog.id);
      const blogAttachments = await BlogModel.getAttachments(blog.id);
      const author = await BlogModel.getAuthor(blog.author_id);

      let place = null;
      if (blog.place_id) {
        const placeResult = await BlogModel.findById(blog.id);
        place = placeResult.place;
      }

      const jiveFormatBlog = BlogModel.transformToJiveFormat(
        blog,
        blogTags,
        blogImages,
        blogAttachments,
        author,
        place
      );

      res.status(201).json(jiveFormatBlog);
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
        status,
        jiveFormat
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
          const author = await BlogModel.getAuthor(blog.author_id);

          if (jiveFormat === 'true') {
            return BlogModel.transformToJiveFormat(
              blog,
              tags,
              images,
              attachments,
              author,
              blog.place
            );
          }

          return {
            ...blog,
            tags,
            images,
            attachments
          };
        })
      );

      if (jiveFormat === 'true') {
        res.status(200).json(blogsWithRelations);
      } else {
        res.status(200).json({
          success: true,
          data: blogsWithRelations
        });
      }
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
      const { jiveFormat } = req.query;

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
      const author = await BlogModel.getAuthor(blog.author_id);

      if (jiveFormat === 'true') {
        const jiveFormatBlog = BlogModel.transformToJiveFormat(
          blog,
          tags,
          images,
          attachments,
          author,
          blog.place
        );
        res.status(200).json(jiveFormatBlog);
      } else {
        res.status(200).json({
          success: true,
          data: {
            ...blog,
            tags,
            images,
            attachments
          }
        });
      }
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

      if (updateData.subject) {
        updateData.title = updateData.subject;
        delete updateData.subject;
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
      if (updateData.restrictReplies !== undefined) {
        updateData.restricted_comments = updateData.restrictReplies;
        delete updateData.restrictReplies;
      }

      const blog = await BlogModel.update(id, updateData);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      const tags = await BlogModel.getTags(blog.id);
      const images = await BlogModel.getImages(blog.id);
      const attachments = await BlogModel.getAttachments(blog.id);
      const author = await BlogModel.getAuthor(blog.author_id);

      const jiveFormatBlog = BlogModel.transformToJiveFormat(
        blog,
        tags,
        images,
        attachments,
        author,
        null
      );

      res.status(200).json(jiveFormatBlog);
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

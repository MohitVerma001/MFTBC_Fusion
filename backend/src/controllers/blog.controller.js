import { BlogModel } from "../models/blog.model.js";
import { TagModel } from "../models/tag.model.js";
import { SubspaceModel } from "../models/subspace.model.js";

export const BlogController = {
  // -----------------------------------
  // CREATE BLOG
  // -----------------------------------
  async createBlog(req, res) {
    try {
      const {
        title,
        subject,
        content,
        content_html,
        contentHtml,
        publishTo,
        publish_to,
        categoryId,
        category_id,
        placeId,
        place_id,
        spaceId,
        space_id,
        restrictReplies,
        restrictedComments,
        tags,
        tagIds,
        tag_ids,
        contentImages,
        attachments,
        authorId,
        author_id,
        isPlaceBlog,
        is_place_blog
      } = req.body;

      const finalTitle = subject || title;
      const finalPublishTo = publishTo || publish_to;
      const finalContent = content || "";
      const finalContentHtml = content_html || contentHtml || content || "";

      if (!finalTitle || !finalContent || !finalPublishTo) {
        return res.status(400).json({
          success: false,
          message: "Title/subject, content, publishTo are required."
        });
      }

      if (finalPublishTo === "HR" && !(categoryId || category_id)) {
        return res.status(400).json({
          success: false,
          message: "Category is required for HR posts."
        });
      }

      // Resolve space (MFTBC default if none passed)
      let finalSpaceId = spaceId || space_id;
      if (!finalSpaceId) {
        const defaultSpace = await SubspaceModel.ensureDefaultMFTBC();
        finalSpaceId = defaultSpace.id;
      }

      const blogData = {
        title: finalTitle,
        content: finalContent,
        content_html: finalContentHtml,
        publish_to: finalPublishTo,
        category_id: categoryId || category_id || null,
        space_id: finalSpaceId,
        place_id: placeId || place_id || null,
        restricted_comments: restrictReplies || restrictedComments || false,
        is_place_blog: isPlaceBlog || is_place_blog || false,
        author_id: authorId || author_id || 1,
        status: "published",
        published_at: new Date()
      };

      const blog = await BlogModel.create(blogData);

      const finalTagIds = tagIds || tag_ids || [];
      if (tags && Array.isArray(tags)) {
        for (const name of tags) {
          const tag = await TagModel.findOrCreate(name);
          finalTagIds.push(tag.id);
        }
      }

      if (finalTagIds.length > 0) {
        await BlogModel.addTags(blog.id, finalTagIds);
      }

      if (contentImages && contentImages.length > 0) {
        await BlogModel.addImages(blog.id, contentImages);
      }

      if (attachments && attachments.length > 0) {
        await BlogModel.addAttachments(blog.id, attachments);
      }

      const blogTags = await BlogModel.getTags(blog.id);
      const blogImages = await BlogModel.getImages(blog.id);
      const blogAttachments = await BlogModel.getAttachments(blog.id);
      const author = await BlogModel.getAuthor(blog.author_id);

      const jiveBlog = BlogModel.transformToJiveFormat(
        blog,
        blogTags,
        blogImages,
        blogAttachments,
        author,
        blog.place
      );

      res.status(201).json(jiveBlog);
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create blog",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // GET ALL BLOGS
  // -----------------------------------
  async getAllBlogs(req, res) {
    try {
      const {
        publish_to,
        publishTo,
        categoryId,
        spaceId,
        space_id,
        placeId,
        authorId,
        search,
        tags,
        from,
        to,
        limit,
        page,
        status,
        jiveFormat
      } = req.query;

      const filters = {
        publishTo: publishTo || publish_to,
        categoryId,
        spaceId: spaceId || space_id,
        placeId,
        authorId,
        search,
        tags,
        from,
        to,
        limit,
        page,
        status
      };

      const result = await BlogModel.findAll(filters);

      const formatted = await Promise.all(
        result.items.map(async (blog) => {
          const tags = await BlogModel.getTags(blog.id);
          const images = await BlogModel.getImages(blog.id);
          const attachments = await BlogModel.getAttachments(blog.id);
          const author = await BlogModel.getAuthor(blog.author_id);

          if (jiveFormat === "true") {
            return BlogModel.transformToJiveFormat(
              blog,
              tags,
              images,
              attachments,
              author,
              blog.place
            );
          }

          return { ...blog, tags, images, attachments };
        })
      );

      if (jiveFormat === "true") {
        return res.json({
          items: formatted,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          totalItems: result.totalItems
        });
      }

      res.json({
        success: true,
        data: formatted,
        pagination: {
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          totalItems: result.totalItems,
          itemsPerPage: result.itemsPerPage
        }
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blogs",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // GET BLOG BY ID
  // -----------------------------------
  async getBlogById(req, res) {
    try {
      const { id } = req.params;
      const { jiveFormat } = req.query;

      const blog = await BlogModel.findById(id);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found"
        });
      }

      const tags = await BlogModel.getTags(blog.id);
      const images = await BlogModel.getImages(blog.id);
      const attachments = await BlogModel.getAttachments(blog.id);
      const author = await BlogModel.getAuthor(blog.author_id);

      if (jiveFormat === "true") {
        return res.json(
          BlogModel.transformToJiveFormat(
            blog,
            tags,
            images,
            attachments,
            author,
            blog.place
          )
        );
      }

      res.json({
        success: true,
        data: { ...blog, tags, images, attachments }
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // UPDATE BLOG
  // -----------------------------------
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      const finalPublishTo = updateData.publishTo || updateData.publish_to;
      if (finalPublishTo) {
        updateData.publish_to = finalPublishTo;
        delete updateData.publishTo;
      }

      if (updateData.categoryId) {
        updateData.category_id = updateData.categoryId;
        delete updateData.categoryId;
      }

      if (updateData.spaceId) {
        updateData.space_id = updateData.spaceId;
        delete updateData.spaceId;
      }

      if (updateData.placeId) {
        updateData.place_id = updateData.placeId;
        delete updateData.placeId;
      }

      if (updateData.subject) {
        updateData.title = updateData.subject;
        delete updateData.subject;
      }

      if (updateData.restrictReplies !== undefined) {
        updateData.restricted_comments = updateData.restrictReplies;
        delete updateData.restrictReplies;
      }

      const blog = await BlogModel.update(id, updateData);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found"
        });
      }

      const tags = await BlogModel.getTags(blog.id);
      const images = await BlogModel.getImages(blog.id);
      const attachments = await BlogModel.getAttachments(blog.id);
      const author = await BlogModel.getAuthor(blog.author_id);

      res.json(
        BlogModel.transformToJiveFormat(
          blog,
          tags,
          images,
          attachments,
          author,
          null
        )
      );
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update blog",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // DELETE BLOG
  // -----------------------------------
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;

      await BlogModel.delete(id);

      res.json({
        success: true,
        message: "Blog deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete blog",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // LIKE BLOG
  // -----------------------------------
  async likeBlog(req, res) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || 1;

      const result = await BlogModel.toggleLike(id, userId);
      const likeCount = await BlogModel.getLikeCount(id);

      res.json({
        success: true,
        liked: result.liked,
        likeCount
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle like",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // UNLIKE BLOG
  // -----------------------------------
  async unlikeBlog(req, res) {
    try {
      const { id } = req.params;
      const userId = req.body.userId || 1;

      await BlogModel.toggleLike(id, userId);
      const likeCount = await BlogModel.getLikeCount(id);

      res.json({
        success: true,
        liked: false,
        likeCount
      });
    } catch (error) {
      console.error("Error unliking:", error);
      res.status(500).json({
        success: false,
        message: "Failed to unlike",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // GET BLOG LIKES
  // -----------------------------------
  async getBlogLikes(req, res) {
    try {
      const { id } = req.params;

      const likes = await BlogModel.getLikes(id);
      const likeCount = await BlogModel.getLikeCount(id);

      res.json({
        success: true,
        data: likes,
        count: likeCount
      });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch likes",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // GET BLOG COMMENTS
  // -----------------------------------
  async getBlogComments(req, res) {
    try {
      const { id } = req.params;

      const comments = await BlogModel.getComments(id);

      res.json({
        success: true,
        data: comments
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch comments",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // ADD COMMENT
  // -----------------------------------
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const { comment, userId } = req.body;

      if (!comment || !comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment is required"
        });
      }

      const finalUserId = userId || 1;
      const newComment = await BlogModel.addComment(id, finalUserId, comment);

      res.status(201).json({
        success: true,
        data: newComment
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add comment",
        error: error.message
      });
    }
  },

  // -----------------------------------
  // DELETE COMMENT
  // -----------------------------------
  async deleteComment(req, res) {
    try {
      const { id, commentId } = req.params;
      const userId = req.body.userId || 1;

      const deletedComment = await BlogModel.deleteComment(commentId, userId);

      if (!deletedComment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or unauthorized"
        });
      }

      res.json({
        success: true,
        message: "Comment deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete comment",
        error: error.message
      });
    }
  }
};

export default BlogController;

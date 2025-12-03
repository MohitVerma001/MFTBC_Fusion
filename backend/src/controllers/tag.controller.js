import { TagModel } from '../models/tag.model.js';

export const TagController = {
  async createTag(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      const tag = await TagModel.create({ name });

      res.status(201).json({
        success: true,
        message: 'Tag created successfully',
        data: tag
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tag',
        error: error.message
      });
    }
  },

  async getAllTags(req, res) {
    try {
      const { search } = req.query;

      const filters = {};
      if (search) filters.search = search;

      const tags = await TagModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: tags
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tags',
        error: error.message
      });
    }
  },

  async getTagById(req, res) {
    try {
      const { id } = req.params;

      const tag = await TagModel.findById(id);

      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }

      res.status(200).json({
        success: true,
        data: tag
      });
    } catch (error) {
      console.error('Error fetching tag:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tag',
        error: error.message
      });
    }
  },

  async updateTag(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      const tag = await TagModel.update(id, { name });

      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
        data: tag
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update tag',
        error: error.message
      });
    }
  },

  async deleteTag(req, res) {
    try {
      const { id } = req.params;

      await TagModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Tag deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete tag',
        error: error.message
      });
    }
  }
};

export default TagController;

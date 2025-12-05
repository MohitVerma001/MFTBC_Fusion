import { SubspaceModel } from '../models/subspace.model.js';

export const SubspaceController = {
  async createSubspace(req, res) {
    try {
      const subspaceData = req.body;

      if (!subspaceData.name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      // Accept camelCase from frontend and map to DB column
      if (subspaceData.parentSubspaceId) {
        subspaceData.parent_subspace_id = subspaceData.parentSubspaceId;
        delete subspaceData.parentSubspaceId;
      }

      const subspace = await SubspaceModel.create(subspaceData);

      res.status(201).json({
        success: true,
        message: 'Subspace created successfully',
        data: subspace
      });
    } catch (error) {
      console.error('Error creating subspace:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create subspace',
        error: error.message
      });
    }
  },

  async getAllSubspaces(req, res) {
    try {
      const { is_published, search, parentSubspaceId, parent_subspace_id, created_by, visibility } = req.query;

      const filters = {};
      if (is_published !== undefined) filters.is_published = is_published === 'true';
      if (search) filters.search = search;
      if (created_by) filters.created_by = created_by;
      if (visibility) filters.visibility = visibility;

      const parentId = parentSubspaceId || parent_subspace_id;
      if (parentId !== undefined) {
        filters.parent_subspace_id = parentId === 'null' ? null : parseInt(parentId, 10);
      }

      // Always ensure "MFTBC" exists as the default parent space
      await SubspaceModel.ensureDefaultMFTBC();

      const subspaces = await SubspaceModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: subspaces
      });
    } catch (error) {
      console.error('Error fetching subspaces:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subspaces',
        error: error.message
      });
    }
  },

  async getSubspaceById(req, res) {
    try {
      const { id } = req.params;

      const subspace = await SubspaceModel.findById(id);

      if (!subspace) {
        return res.status(404).json({
          success: false,
          message: 'Subspace not found'
        });
      }

      res.status(200).json({
        success: true,
        data: subspace
      });
    } catch (error) {
      console.error('Error fetching subspace:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subspace',
        error: error.message
      });
    }
  },

  async updateSubspace(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.parentSubspaceId !== undefined) {
        updateData.parent_subspace_id = updateData.parentSubspaceId;
        delete updateData.parentSubspaceId;
      }

      const subspace = await SubspaceModel.update(id, updateData);

      if (!subspace) {
        return res.status(404).json({
          success: false,
          message: 'Subspace not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Subspace updated successfully',
        data: subspace
      });
    } catch (error) {
      console.error('Error updating subspace:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update subspace',
        error: error.message
      });
    }
  },

  async deleteSubspace(req, res) {
    try {
      const { id } = req.params;

      await SubspaceModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Subspace deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting subspace:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete subspace',
        error: error.message
      });
    }
  }
};

export default SubspaceController;

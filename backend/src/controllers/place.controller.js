import { PlaceModel } from '../models/place.model.js';

export const PlaceController = {
  async createPlace(req, res) {
    try {
      const { name, description, type } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Place name is required'
        });
      }

      const placeData = {
        name,
        description: description || null,
        type: type || null
      };

      const place = await PlaceModel.create(placeData);

      res.status(201).json({
        success: true,
        message: 'Place created successfully',
        data: place
      });
    } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create place',
        error: error.message
      });
    }
  },

  async getAllPlaces(req, res) {
    try {
      const { type } = req.query;

      const filters = {};
      if (type) filters.type = type;

      const places = await PlaceModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: places
      });
    } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch places',
        error: error.message
      });
    }
  },

  async getPlaceById(req, res) {
    try {
      const { id } = req.params;
      const place = await PlaceModel.findById(id);

      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Place not found'
        });
      }

      res.status(200).json({
        success: true,
        data: place
      });
    } catch (error) {
      console.error('Error fetching place:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch place',
        error: error.message
      });
    }
  },

  async updatePlace(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const place = await PlaceModel.update(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Place updated successfully',
        data: place
      });
    } catch (error) {
      console.error('Error updating place:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update place',
        error: error.message
      });
    }
  },

  async deletePlace(req, res) {
    try {
      const { id } = req.params;

      await PlaceModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Place deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting place:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete place',
        error: error.message
      });
    }
  }
};

export default PlaceController;

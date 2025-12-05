import { SpacesModel } from '../models/spaces.model.js';

export const SpacesController = {
  async getAllSpaces(req, res) {
    try {
      const spaces = await SpacesModel.findAll();
      res.json({
        success: true,
        data: spaces
      });
    } catch (error) {
      console.error('Error fetching spaces:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch spaces',
        error: error.message
      });
    }
  },

  async getBusinessKeys(req, res) {
    try {
      const businessKeys = await SpacesModel.getBusinessKeys();
      res.json({
        success: true,
        data: businessKeys
      });
    } catch (error) {
      console.error('Error fetching business keys:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch business keys',
        error: error.message
      });
    }
  },

  async getLanguages(req, res) {
    try {
      const languages = await SpacesModel.getLanguages();
      res.json({
        success: true,
        data: languages
      });
    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch languages',
        error: error.message
      });
    }
  },

  async resolveSpace(req, res) {
    try {
      const { businessKey, language } = req.query;

      if (!businessKey || !language) {
        return res.status(400).json({
          success: false,
          message: 'businessKey and language are required'
        });
      }

      const space = await SpacesModel.findByBusinessKeyAndLanguage(businessKey, language);

      if (!space) {
        return res.status(404).json({
          success: false,
          message: 'Space not found for given businessKey and language'
        });
      }

      res.json({
        success: true,
        data: space
      });
    } catch (error) {
      console.error('Error resolving space:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve space',
        error: error.message
      });
    }
  }
};

export default SpacesController;

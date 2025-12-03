import { CategoryModel } from '../models/category.model.js';

export const CategoryController = {
  async createCategory(req, res) {
    try {
      const categoryData = req.body;

      if (!categoryData.name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      const category = await CategoryModel.create(categoryData);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      });
    }
  },

  async getAllCategories(req, res) {
    try {
      const { type, parent_category, is_published } = req.query;

      const filters = {};
      if (type) filters.type = type;
      if (parent_category !== undefined) filters.parent_category = parent_category === 'null' ? null : parseInt(parent_category);
      if (is_published !== undefined) filters.is_published = is_published === 'true';

      const categories = await CategoryModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  },

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category',
        error: error.message
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await CategoryModel.update(id, updateData);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message
      });
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      await CategoryModel.delete(id);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message
      });
    }
  }
};

export default CategoryController;

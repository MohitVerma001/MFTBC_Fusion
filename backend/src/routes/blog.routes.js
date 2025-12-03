import express from 'express';
import { BlogController } from '../controllers/blog.controller.js';

const router = express.Router();

router.post('/', BlogController.createBlog);
router.get('/', BlogController.getAllBlogs);
router.get('/:id', BlogController.getBlogById);
router.put('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);

export default router;

import express from 'express';
import BlogController from '../controllers/blog.controller.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post(
  '/blogs',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'attachments', maxCount: 5 }
  ]),
  BlogController.createBlog
);

router.get('/blogs', BlogController.getAllBlogs);

router.get('/blogs/:id', BlogController.getBlogById);

router.put('/blogs/:id', BlogController.updateBlog);

router.delete('/blogs/:id', BlogController.deleteBlog);

router.get('/categories', BlogController.getCategories);

router.get('/tags', BlogController.getTags);

router.post('/tags', BlogController.createTag);

router.get('/places', BlogController.getPlaces);

export default router;

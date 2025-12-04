import express from 'express';
import { BlogController } from '../controllers/blog.controller.js';

const router = express.Router();

router.post('/', BlogController.createBlog);
router.get('/', BlogController.getAllBlogs);
router.get('/:id', BlogController.getBlogById);
router.put('/:id', BlogController.updateBlog);
router.delete('/:id', BlogController.deleteBlog);

router.post('/:id/like', BlogController.likeBlog);
router.post('/:id/unlike', BlogController.unlikeBlog);
router.get('/:id/likes', BlogController.getBlogLikes);

router.get('/:id/comments', BlogController.getBlogComments);
router.post('/:id/comments', BlogController.addComment);
router.delete('/:id/comments/:commentId', BlogController.deleteComment);

export default router;

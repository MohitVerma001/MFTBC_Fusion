import express from 'express';
import * as engagementController from '../controllers/engagement.controller.js';

const router = express.Router();

router.post('/blogs/:blogId/like', engagementController.toggleLike);
router.get('/blogs/:blogId/like/count', engagementController.getLikeCount);
router.get('/blogs/:blogId/like/check', engagementController.checkUserLiked);

router.post('/blogs/:blogId/comments', engagementController.addComment);
router.get('/blogs/:blogId/comments', engagementController.getComments);
router.delete('/comments/:commentId', engagementController.deleteComment);

router.post('/blogs/:blogId/bookmark', engagementController.toggleBookmark);
router.get('/blogs/:blogId/bookmark/check', engagementController.checkUserBookmarked);

export default router;

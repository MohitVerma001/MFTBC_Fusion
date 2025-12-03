import express from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', uploadMiddleware.single('file'), UploadController.uploadFile);
router.post('/multiple', uploadMiddleware.array('files', 10), UploadController.uploadMultiple);

export default router;

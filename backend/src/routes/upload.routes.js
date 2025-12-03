import express from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/single', upload.single('file'), UploadController.uploadFile);
router.post('/multiple', upload.array('files', 10), UploadController.uploadMultipleFiles);

export default router;

import express from 'express';
import { SpacesController } from '../controllers/spaces.controller.js';

const router = express.Router();

router.get('/', SpacesController.getAllSpaces);
router.get('/business-keys', SpacesController.getBusinessKeys);
router.get('/languages', SpacesController.getLanguages);
router.get('/resolve', SpacesController.resolveSpace);

export default router;

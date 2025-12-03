import express from 'express';
import { PlaceController } from '../controllers/place.controller.js';

const router = express.Router();

router.post('/', PlaceController.createPlace);
router.get('/', PlaceController.getAllPlaces);
router.get('/:id', PlaceController.getPlaceById);
router.put('/:id', PlaceController.updatePlace);
router.delete('/:id', PlaceController.deletePlace);

export default router;

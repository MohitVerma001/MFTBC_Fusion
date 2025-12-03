import express from 'express';
import { SubspaceController } from '../controllers/subspace.controller.js';

const router = express.Router();

router.post('/', SubspaceController.createSubspace);
router.get('/', SubspaceController.getAllSubspaces);
router.get('/:id', SubspaceController.getSubspaceById);
router.put('/:id', SubspaceController.updateSubspace);
router.delete('/:id', SubspaceController.deleteSubspace);

export default router;

import express from 'express';
import { SubspaceController } from '../controllers/subspace.controller.js';

const router = express.Router();

// Create subspace (space)
router.post('/', SubspaceController.createSubspace);

// Get all subspaces (with optional filters: is_published, search, parentSubspaceId)
router.get('/', SubspaceController.getAllSubspaces);

// Get subspace by ID
router.get('/:id', SubspaceController.getSubspaceById);

// Update subspace
router.put('/:id', SubspaceController.updateSubspace);

// Delete subspace
router.delete('/:id', SubspaceController.deleteSubspace);

export default router;

import express from 'express';
import { SubspaceController } from '../controllers/subspace.controller.js';

const router = express.Router();

// Create subspace (space)
router.post('/', SubspaceController.createSubspace);

// Get root spaces
router.get('/root', SubspaceController.getRootSpaces);

// Get child spaces of a parent
router.get('/:parentId/children', SubspaceController.getChildSpaces);

// Get space hierarchy
router.get('/:id/hierarchy', SubspaceController.getSpaceHierarchy);

// Get all subspaces (with optional filters: is_published, search, parent_space_id)
router.get('/', SubspaceController.getAllSubspaces);

// Get subspace by ID
router.get('/:id', SubspaceController.getSubspaceById);

// Update subspace
router.put('/:id', SubspaceController.updateSubspace);

// Delete subspace
router.delete('/:id', SubspaceController.deleteSubspace);

export default router;

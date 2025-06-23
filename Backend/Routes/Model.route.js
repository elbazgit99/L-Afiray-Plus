import express from 'express';
import ModelController from '../Controllers/Model.controller.js';

const router = express.Router();

// Get all models
router.get('/', ModelController.getAllModels);

// Get a single model by ID
router.get('/:id', ModelController.getModelById);

// Create a new model
router.post('/', ModelController.createModel);

// Update a model by ID
router.put('/:id', ModelController.updateModel);

// Delete a model by ID
router.delete('/:id', ModelController.deleteModel);

export default router;
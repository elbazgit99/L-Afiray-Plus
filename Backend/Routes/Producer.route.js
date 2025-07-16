import express from 'express';
// Importing the controller functions
import {
    createProducer,
    getAllProducers,
    getProducerById,
    updateProducer,
    deleteProducer,
    deleteAllProducers,
    deleteAllProducersAndModels, // <-- add import
} from "../Controllers/Producer.controller.js";
import { authenticateToken, authorize } from '../Middleware/AuthMiddleware.js'; // Import middlewares
import ROLES from '../Constants/UserRoles.js'; // Import ROLES
import upload from '../Middleware/uploadMiddleware.js'; // Import upload middleware

const ProducerRouter = express.Router();

// Public routes: Anyone can view producers
ProducerRouter.get('/', getAllProducers);
ProducerRouter.get('/:id', getProducerById);

// Protected routes: Only Partners and Moderators can perform CRUD on Producers
ProducerRouter.post('/', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), upload.single('imageFile'), createProducer);
ProducerRouter.put('/:id', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), updateProducer);
ProducerRouter.delete('/:id', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), deleteProducer);

// Add admin utility route to delete all producers
ProducerRouter.post('/delete-all', authenticateToken, authorize([ROLES.MODERATOR]), deleteAllProducers);
// Add admin utility route to delete all producers and their models
ProducerRouter.post('/delete-all-producers-and-models', authenticateToken, authorize([ROLES.MODERATOR]), deleteAllProducersAndModels);

export default ProducerRouter;

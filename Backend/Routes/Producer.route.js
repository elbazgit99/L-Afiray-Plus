import express from 'express';
// Importing the controller functions
import {
    createProducer,
    getAllProducers,
    getProducerById,
    updateProducer,
    deleteProducer,
} from "../Controllers/Producer.controller.js";
import { authMiddleware, authorize } from '../Middleware/AuthMiddleware.js'; // Import middlewares
import ROLES from '../Constants/UserRoles.js'; // Import ROLES

const ProducerRouter = express.Router();

// Public routes: Anyone can view producers
ProducerRouter.get('/', getAllProducers);
ProducerRouter.get('/:id', getProducerById);

// Protected routes: Only Partners and Moderators can perform CRUD on Producers
ProducerRouter.post('/', authMiddleware, authorize([ROLES.PARTNER, ROLES.MODERATOR]), createProducer);
ProducerRouter.put('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.MODERATOR]), updateProducer);
ProducerRouter.delete('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.MODERATOR]), deleteProducer);

export default ProducerRouter;

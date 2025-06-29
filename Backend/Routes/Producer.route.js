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

// Only Partners and Admins can perform CRUD on Producers
ProducerRouter.post('/', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), createProducer);
ProducerRouter.get('/', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN, ROLES.BUYER]), getAllProducers); // Buyers can also view producers
ProducerRouter.get('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN, ROLES.BUYER]), getProducerById); // Buyers can also view producers
ProducerRouter.put('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), updateProducer);
ProducerRouter.delete('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), deleteProducer);

export default ProducerRouter;

import express from 'express';
import {
    getAllCarParts,
    getCarPartById,
    createCarPart,
    updateCarPart,
    deleteCarPart,
    getCarPartsByCarModel,
    getCarPartsByProducer
} from '../Controllers/CarParts.controller.js';
import { authMiddleware, authorize } from '../Middleware/AuthMiddleware.js'; // Import middlewares
import ROLES from '../Constants/UserRoles.js'; // Import ROLES

const CarPartsRouter = express.Router();

// Define validation rules if you had them for express-validator.
// For now, these are commented out as `express-validator` was not provided.

// Only Partners and Admins can perform CRUD on Car Parts
CarPartsRouter.post('/', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), createCarPart);
CarPartsRouter.get('/', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN, ROLES.BUYER]), getAllCarParts); // Buyers can view all parts
CarPartsRouter.get('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN, ROLES.BUYER]), getCarPartById); // Buyers can view parts by ID
CarPartsRouter.put('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), updateCarPart);
CarPartsRouter.delete('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), deleteCarPart);

// Specific GET routes, also protected
CarPartsRouter.get('/carModel/:carModelId', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN, ROLES.BUYER]), getCarPartsByCarModel);
CarPartsRouter.get('/producer/:producerId', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN, ROLES.BUYER]), getCarPartsByProducer);

export default CarPartsRouter;

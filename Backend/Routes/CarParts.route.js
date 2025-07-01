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
import { authMiddleware, authorize } from '../Middleware/AuthMiddleware.js';
import ROLES from '../Constants/UserRoles.js';

const CarPartsRouter = express.Router();

// Public route: Anyone can view all car parts
CarPartsRouter.get('/', getAllCarParts); // Removed authMiddleware and authorize

// Public route: Anyone can view a single car part by ID
CarPartsRouter.get('/:id', getCarPartById); // Removed authMiddleware and authorize

// Public routes: Anyone can view car parts by car model or producer ID
CarPartsRouter.get('/carModel/:carModelId', getCarPartsByCarModel); // Removed authMiddleware and authorize
CarPartsRouter.get('/producer/:producerId', getCarPartsByProducer); // Removed authMiddleware and authorize

// Protected routes: Only Partners and Admins can perform CRUD on Car Parts
CarPartsRouter.post('/', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), createCarPart);
CarPartsRouter.put('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), updateCarPart);
CarPartsRouter.delete('/:id', authMiddleware, authorize([ROLES.PARTNER, ROLES.ADMIN]), deleteCarPart);


export default CarPartsRouter;

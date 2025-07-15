import express from 'express';
import {
    getAllCarParts,
    getCarPartById,
    createCarPart,
    updateCarPart,
    deleteCarPart,
    getCarPartsByCarModel,
    getCarPartsByProducer,
    getFeaturedCarParts,
    toggleFeaturedStatus
} from '../Controllers/CarParts.controller.js';
import { authenticateToken, authorize } from '../Middleware/AuthMiddleware.js';
import ROLES from '../Constants/UserRoles.js';
import upload from '../Middleware/uploadMiddleware.js';

const CarPartsRouter = express.Router();

// Public route: Anyone can view all car parts
CarPartsRouter.get('/', getAllCarParts); // Removed authMiddleware and authorize

// Public route: Get featured car parts only
CarPartsRouter.get('/featured', getFeaturedCarParts);

// Public route: Anyone can view a single car part by ID
CarPartsRouter.get('/:id', getCarPartById); // Removed authMiddleware and authorize

// Public routes: Anyone can view car parts by car model or producer ID
CarPartsRouter.get('/carModel/:carModelId', getCarPartsByCarModel); // Removed authMiddleware and authorize
CarPartsRouter.get('/producer/:producerId', getCarPartsByProducer); // Removed authMiddleware and authorize

// Protected routes: Only Partners and Moderators can perform CRUD on Car Parts
CarPartsRouter.post('/', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), upload.single('imageFile'), createCarPart);
CarPartsRouter.put('/:id', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), upload.single('imageFile'), updateCarPart);
CarPartsRouter.delete('/:id', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), deleteCarPart);

// Moderator only: Toggle featured status
CarPartsRouter.patch('/:id/toggle-featured', authenticateToken, authorize([ROLES.MODERATOR]), toggleFeaturedStatus);

export default CarPartsRouter;

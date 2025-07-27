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

CarPartsRouter.get('/', getAllCarParts);

// // Public routes: Anyone can view all car parts
CarPartsRouter.get('/featured', getFeaturedCarParts);
CarPartsRouter.get('/:id', getCarPartById);
CarPartsRouter.get('/carModel/:carModelId', getCarPartsByCarModel);
CarPartsRouter.get('/producer/:producerId', getCarPartsByProducer); 
// Protected routes: Only Partners and Moderators can perform CRUD on Car Parts
CarPartsRouter.post('/', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), upload.single('imageFile'), createCarPart);
CarPartsRouter.put('/:id', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), upload.single('imageFile'), updateCarPart);
CarPartsRouter.delete('/:id', authenticateToken, authorize([ROLES.PARTNER, ROLES.MODERATOR]), deleteCarPart);
// Moderator only: Toggle featured status
CarPartsRouter.patch('/:id/toggle-featured', authenticateToken, authorize([ROLES.MODERATOR]), toggleFeaturedStatus);

export default CarPartsRouter;

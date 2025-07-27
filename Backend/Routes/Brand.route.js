import express from 'express';
import {  createBrand,
          getAllBrands,
          getBrandById,
          updateBrand,
          deleteBrand
} from '../Controllers/Brand.controller.js';
import { authenticateToken } from '../Middleware/AuthMiddleware.js';
import upload from '../Middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('imageFile'), createBrand);
router.get('/', getAllBrands);
router.get('/:id', getBrandById);
router.put('/:id', authenticateToken, upload.single('imageFile'), updateBrand);
router.delete('/:id', authenticateToken, deleteBrand);

export default router; 
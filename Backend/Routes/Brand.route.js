import express from 'express';
import { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand } from '../Controllers/Brand.controller.js';
import { authenticateToken } from '../Middleware/AuthMiddleware.js';
import upload from '../Middleware/uploadMiddleware.js';

const router = express.Router();

// Create brand (with image upload)
router.post('/', authenticateToken, upload.single('imageFile'), createBrand);

// Get all brands
router.get('/', getAllBrands);

// Get brand by id
router.get('/:id', getBrandById);

// Update brand (with image upload)
router.put('/:id', authenticateToken, upload.single('imageFile'), updateBrand);

// Delete brand
router.delete('/:id', authenticateToken, deleteBrand);

export default router; 
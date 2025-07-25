import express from 'express';
import { createSale, getSalesByPartner, getSalesCountByPart, getSalesCountByPartner, getTotalSalesCount } from '../Controllers/Sale.controller.js';

const router = express.Router();

// POST /api/sales
router.post('/', createSale);

// GET /api/sales/partner/:partnerId
router.get('/partner/:partnerId', getSalesByPartner);

// Add sales count endpoints
router.get('/part/:partId/count', getSalesCountByPart);
router.get('/partner/:partnerId/count', getSalesCountByPartner);
router.get('/count', getTotalSalesCount);

export default router; 
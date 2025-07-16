import express from 'express';
import { createSale, getSalesByPartner } from '../Controllers/Sale.controller.js';

const router = express.Router();

// POST /api/sales
router.post('/', createSale);

// GET /api/sales/partner/:partnerId
router.get('/partner/:partnerId', getSalesByPartner);

export default router; 
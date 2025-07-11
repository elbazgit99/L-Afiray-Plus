import express from 'express';
import {
  getAllReports,
  createReport,
  updateReport,
  getAllDisputes,
  createDispute,
  updateDispute,
  getModerationStats,
  getAuditTrail
} from '../Controllers/Moderation.controller.js';
import { authMiddleware, authorize } from '../Middleware/AuthMiddleware.js';
import ROLES from '../Constants/UserRoles.js';

const router = express.Router();

// Reports routes
router.get('/reports', authMiddleware, authorize([ROLES.MODERATOR]), getAllReports);
router.post('/reports', authMiddleware, createReport); // Any authenticated user can create reports
router.put('/reports/:id', authMiddleware, authorize([ROLES.MODERATOR]), updateReport);

// Disputes routes
router.get('/disputes', authMiddleware, authorize([ROLES.MODERATOR]), getAllDisputes);
router.post('/disputes', authMiddleware, createDispute); // Any authenticated user can create disputes
router.put('/disputes/:id', authMiddleware, authorize([ROLES.MODERATOR]), updateDispute);

// Statistics and audit routes (moderator only)
router.get('/stats', authMiddleware, authorize([ROLES.MODERATOR]), getModerationStats);
router.get('/audit', authMiddleware, authorize([ROLES.MODERATOR]), getAuditTrail);

export default router; 
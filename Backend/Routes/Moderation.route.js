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
import { authenticateToken, authorize } from '../Middleware/AuthMiddleware.js';
import ROLES from '../Constants/UserRoles.js';

const router = express.Router();

// Reports routes
router.get('/reports', authenticateToken, authorize([ROLES.MODERATOR]), getAllReports);
router.post('/reports', authenticateToken, createReport); // Any authenticated user can create reports
router.put('/reports/:id', authenticateToken, authorize([ROLES.MODERATOR]), updateReport);
// Disputes routes
router.get('/disputes', authenticateToken, authorize([ROLES.MODERATOR]), getAllDisputes);
router.post('/disputes', authenticateToken, createDispute); // Any authenticated user can create disputes
router.put('/disputes/:id', authenticateToken, authorize([ROLES.MODERATOR]), updateDispute);
// Statistics and audit routes (moderator only)
router.get('/stats', authenticateToken, authorize([ROLES.MODERATOR]), getModerationStats);
router.get('/audit', authenticateToken, authorize([ROLES.MODERATOR]), getAuditTrail);

export default router; 
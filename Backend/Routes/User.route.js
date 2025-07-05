import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser, // New: for user registration
    loginUser,    // New: for user login
    getPartners,
    approvePartner,
    rejectPartner,
    createModerator,
    initializeModerator
} from '../Controllers/User.controller.js';
import { authMiddleware, authorize } from '../Middleware/AuthMiddleware.js'; // Import both middlewares
import ROLES from '../Constants/UserRoles.js'; // Import ROLES constant

const UserRouter = express.Router();

// Public routes for authentication (no token required)
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);

// Test email route (for development/testing only)
UserRouter.get('/test-email', async (req, res) => {
  try {
    const { sendEmail } = await import('../Config/emailService.js');
    const result = await sendEmail('test@example.com', 'partnerApproved', {
      partnerName: 'Test Partner',
      companyName: 'Test Company'
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes (require authentication and specific roles)
// Moderator can manage all users
UserRouter.get('/', authMiddleware, authorize([ROLES.MODERATOR]), getAllUsers);
UserRouter.get('/partners', authMiddleware, authorize([ROLES.MODERATOR]), getPartners); // Get all partners
UserRouter.get('/:id', authMiddleware, authorize([ROLES.MODERATOR, ROLES.PARTNER, ROLES.BUYER]), getUserById); // User can view their own, Moderator can view all
UserRouter.post('/', authMiddleware, authorize([ROLES.MODERATOR]), createUser); // Moderator adds partners/users manually
UserRouter.put('/:id', authMiddleware, authorize([ROLES.MODERATOR, ROLES.PARTNER, ROLES.BUYER]), updateUser); // Moderator can update any, User can update their own
UserRouter.put('/:id/approve', authMiddleware, authorize([ROLES.MODERATOR]), approvePartner); // Approve partner
UserRouter.put('/:id/reject', authMiddleware, authorize([ROLES.MODERATOR]), rejectPartner); // Reject partner
UserRouter.delete('/:id', authMiddleware, authorize([ROLES.MODERATOR]), deleteUser); // Only Moderator can delete users
UserRouter.post('/create-moderator', createModerator); // (Remove after first use!)
UserRouter.post('/initialize-moderator', initializeModerator); // Public endpoint for first-time setup

export default UserRouter;

import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser, // New: for user registration
    loginUser     // New: for user login
} from '../Controllers/User.controller.js';
import { authMiddleware, authorize } from '../Middleware/AuthMiddleware.js'; // Import both middlewares
import ROLES from '../Constants/UserRoles.js'; // Import ROLES constant

const UserRouter = express.Router();

// Public routes for authentication (no token required)
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);

// Protected routes (require authentication and specific roles)
// Admin can manage all users
UserRouter.get('/', authMiddleware, authorize([ROLES.ADMIN]), getAllUsers);
UserRouter.get('/:id', authMiddleware, authorize([ROLES.ADMIN, ROLES.PARTNER, ROLES.BUYER]), getUserById); // User can view their own, Admin can view all
UserRouter.post('/', authMiddleware, authorize([ROLES.ADMIN]), createUser); // Admin adds partners/users manually
UserRouter.put('/:id', authMiddleware, authorize([ROLES.ADMIN, ROLES.PARTNER, ROLES.BUYER]), updateUser); // Admin can update any, User can update their own
UserRouter.delete('/:id', authMiddleware, authorize([ROLES.ADMIN]), deleteUser); // Only Admin can delete users

export default UserRouter;

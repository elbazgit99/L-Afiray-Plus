import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    approvePartner, 
    rejectPartner, 
    createModerator, 
    initializeModerator,
    forgotPassword,
    resetPassword,
    verifyResetCode,
    uploadProfileImage
} from '../Controllers/User.controller.js';
import { authenticateToken } from '../Middleware/AuthMiddleware.js';
import { authorize } from '../Middleware/Roles.js';
import ROLES from '../Constants/UserRoles.js';
import upload from '../Middleware/uploadMiddleware.js'; // Import upload middleware

const UserRouter = express.Router();

// Public routes
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.post('/forgot-password', forgotPassword);
UserRouter.post('/reset-password', resetPassword);
UserRouter.post('/initialize-moderator', initializeModerator);
UserRouter.post('/verify-reset-code', verifyResetCode);

// Protected routes - require authentication
UserRouter.use(authenticateToken);

// Profile image upload route
UserRouter.put('/profile-image', upload.single('profileImage'), uploadProfileImage);

// Moderator only routes
UserRouter.get('/', authorize(ROLES.MODERATOR), getAllUsers);
UserRouter.get('/partners', authorize(ROLES.MODERATOR), getAllUsers);
UserRouter.get('/:id', authorize(ROLES.MODERATOR), getUserById);
UserRouter.post('/', authorize(ROLES.MODERATOR), createUser);
UserRouter.put('/:id', updateUser); // User can update their own profile, moderator can update any
UserRouter.delete('/:id', authorize(ROLES.MODERATOR), deleteUser);
UserRouter.put('/:id/approve', authorize(ROLES.MODERATOR), approvePartner);
UserRouter.put('/:id/reject', authorize(ROLES.MODERATOR), rejectPartner);
UserRouter.post('/create-moderator', authorize(ROLES.MODERATOR), createModerator);

export default UserRouter;

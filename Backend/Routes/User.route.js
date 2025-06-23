import express from 'express';
import {

getAllUsers,
getUserById,
createUser,
updateUser,
deleteUser
} from '../Controllers/User.controller.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

export default router;
import express from 'express';
import {

getAllUsers,
getUserById,
createUser,
updateUser,
deleteUser
} from '../Controllers/User.controller.js';

const UserRouter = express.Router();


UserRouter.get('/', getAllUsers);
UserRouter.get('/:id', getUserById);
UserRouter.post('/', createUser);
UserRouter.put('/:id', updateUser);
UserRouter.delete('/:id', deleteUser);

export default UserRouter;
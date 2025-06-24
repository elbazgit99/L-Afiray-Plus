import express from 'express'
import {
     createRole,
     getAllRoles,
     getRoleById,
} from '../Controllers/Roles.controller.js'

const RolesRouter = express.Router()

RolesRouter.post('/role',createRole)
RolesRouter.get('/roles',getAllRoles)
RolesRouter.get('/role/:id',getRoleById)

export default RolesRouter
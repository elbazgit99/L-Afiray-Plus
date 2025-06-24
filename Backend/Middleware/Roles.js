// export const checkUserRoles = (...allowedRoles) => {
//      return (req, res, next) => {
//           // Assuming req.user.role is an array of roles (e.g., ['admin', 'seller'])
//           // If it's a string, adjust accordingly
//           const userRoles = Array.isArray(req.user?.role) ? req.user.role : [req.user?.role];

//           if (!req.user || !userRoles.some(role => allowedRoles.includes(role))) {
//                return res.status(403).json({ message: "Access denied" });
//           }
//           next();
//      };
// };


// Example: In a middleware for role-based access control
import ROLES from '../Constants/UserRoles.js'; // Adjust path as necessary

export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // Assuming req.user is populated from an authentication middleware
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient role.' });
        }
        next();
    };
};

// Example usage in a route file:
// import { Router } from 'express';
// import ROLES from '../Constants/roles.js';
// const router = Router();
// router.get('/partner-dashboard', authorize([ROLES.PARTNER]), (req, res) => { /* ... */ });
// router.post('/create-order', authorize([ROLES.BUYER]), (req, res) => { /* ... */ });
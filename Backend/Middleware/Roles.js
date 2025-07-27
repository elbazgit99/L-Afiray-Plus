import ROLES from '../Constants/UserRoles.js';

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
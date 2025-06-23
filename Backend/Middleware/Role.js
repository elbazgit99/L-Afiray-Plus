export const checkUserRoles = (...allowedRoles) => {
     return (req, res, next) => {
          // Assuming req.user.role is an array of roles (e.g., ['admin', 'seller'])
          // If it's a string, adjust accordingly
          const userRoles = Array.isArray(req.user?.role) ? req.user.role : [req.user?.role];

          if (!req.user || !userRoles.some(role => allowedRoles.includes(role))) {
               return res.status(403).json({ message: "Access denied" });
          }
          next();
     };
};
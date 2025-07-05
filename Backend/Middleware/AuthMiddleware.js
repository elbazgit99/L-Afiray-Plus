import jwt from "jsonwebtoken";

// Auth middleware for protecting routes
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

        try {
            // Verify token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user information (id and role) from the decoded token to the request object
            // This information will be used by the authorize middleware or controllers.
            req.user = { id: decoded.id, role: decoded.role };

            next(); // Proceed to the next middleware/route handler

        } catch (error) {
            // Handle various JWT errors (e.g., TokenExpiredError, JsonWebTokenError)
            console.error("JWT verification error:", error.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }
};

// Authorization middleware for role-based access control
// Takes an array of allowed roles (e.g., ['MODERATOR', 'PARTNER'])
export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // req.user should have been populated by authMiddleware before this runs
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Authentication required for role check.' });
        }

        // Check if the user's role is included in the allowed roles for this route
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Requires one of: ${allowedRoles.join(', ')} roles.` });
        }
        next(); // User is authorized, proceed
    };
};

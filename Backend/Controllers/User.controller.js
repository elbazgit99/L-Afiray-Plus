import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ROLES from '../Constants/UserRoles.js'; 

// to help function generate a JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password, role, companyName, companyAddress, shippingAddress, phone, approvalCode } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // to Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user based on role
        const newUserFields = {
            name,
            email,
            password: hashedPassword,
            role,
            phone // Phone is optional, can be for any role
        };

        if (role === ROLES.PARTNER) {
            if (!companyName || !companyAddress) {
                return res.status(400).json({ message: 'Company name and address are required for partners' });
            }
            newUserFields.companyName = companyName;
            newUserFields.companyAddress = companyAddress;
            
            // Handle approval code for partners
            if (approvalCode) {
                // Check if the approval code matches any existing partner's code
                const partnerWithCode = await User.findOne({ 
                    role: ROLES.PARTNER, 
                    approvalCode: approvalCode,
                    isApproved: false 
                });
                
                if (partnerWithCode) {
                    // If code matches, approve the partner
                    newUserFields.isApproved = true;
                    newUserFields.approvalCode = null; // Clear the used code
                    
                    // Also clear the code from the original partner
                    partnerWithCode.approvalCode = null;
                    await partnerWithCode.save();
                } else {
                    // If no valid code provided, partner starts as unapproved
                    newUserFields.isApproved = false;
                }
            } else {
                // No approval code provided, partner starts as unapproved
                newUserFields.isApproved = false;
            }
        } else if (role === ROLES.BUYER) {
            if (!shippingAddress) {
                return res.status(400).json({ message: 'Shipping address is required for buyers' });
            }
            newUserFields.shippingAddress = shippingAddress;
        } else if (role === ROLES.ADMIN) {
             // Admin specific fields can be added here if needed, or simply no additional fields
        } else {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        user = new User(newUserFields);
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
        });

    } catch (err) {
        // Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

// --- Existing User CRUD functions (will be protected by middleware in routes) ---

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user by ID (Admin or User themselves)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Allow user to fetch their own profile, or admin to fetch any
        if (req.user.role !== ROLES.ADMIN && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new user (Admin only - for manual adding of partners by admin)
export const createUser = async (req, res) => {
    const { name, email, password, role, companyName, companyAddress, shippingAddress, phone } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user based on role
        const newUserFields = {
            name,
            email,
            password: hashedPassword,
            role,
            phone
        };

        if (role === ROLES.PARTNER) {
            if (!companyName || !companyAddress) {
                return res.status(400).json({ message: 'Company name and address are required for partners' });
            }
            newUserFields.companyName = companyName;
            newUserFields.companyAddress = companyAddress;
            
            // Handle approval code for partners
            if (approvalCode) {
                // Check if the approval code matches any existing partner's code
                const partnerWithCode = await User.findOne({ 
                    role: ROLES.PARTNER, 
                    approvalCode: approvalCode,
                    isApproved: false 
                });
                
                if (partnerWithCode) {
                    // If code matches, approve the partner
                    newUserFields.isApproved = true;
                    newUserFields.approvalCode = null; // Clear the used code
                    
                    // Also clear the code from the original partner
                    partnerWithCode.approvalCode = null;
                    await partnerWithCode.save();
                } else {
                    // If no valid code provided, partner starts as unapproved
                    newUserFields.isApproved = false;
                }
            } else {
                // No approval code provided, partner starts as unapproved
                newUserFields.isApproved = false;
            }
        } else if (role === ROLES.BUYER) {
            if (!shippingAddress) {
                return res.status(400).json({ message: 'Shipping address is required for buyers' });
            }
            newUserFields.shippingAddress = shippingAddress;
        } else if (role === ROLES.ADMIN) {
             // No additional fields specifically required for ADMIN on creation
        } else {
            return res.status(400).json({ message: 'Invalid user role' });
        }

        user = new User(newUserFields);
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error during user creation', error: err.message });
    }
};

// Update user (Admin or User themselves)
export const updateUser = async (req, res) => {
    const { name, email, password, role, companyName, companyAddress, shippingAddress, phone } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Authorization check: User can only update their own profile unless they are an ADMIN
        if (req.user.role !== ROLES.ADMIN && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
        }
        // Only Admin can change role
        if (req.user.role !== ROLES.ADMIN && role && role !== user.role) {
            return res.status(403).json({ message: 'Only administrators can change user roles.' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email; // Consider unique email validation on update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (role) user.role = role;
        if (companyName) user.companyName = companyName;
        if (companyAddress) user.companyAddress = companyAddress;
        if (shippingAddress) user.shippingAddress = shippingAddress;
        if (phone) user.phone = phone;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(400).json({ message: err.message });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all partners (Admin only)
export const getPartners = async (req, res) => {
    try {
        const partners = await User.find({ role: ROLES.PARTNER }).select('-password');
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Generate approval code for partner (Admin only)
export const generateApprovalCode = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role !== ROLES.PARTNER) {
            return res.status(400).json({ message: 'Can only generate approval codes for partners' });
        }

        // Generate a random 6-digit code
        const approvalCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.approvalCode = approvalCode;
        await user.save();

        res.json({ 
            message: 'Approval code generated successfully',
            approvalCode: approvalCode 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Approve partner (Admin only)
export const approvePartner = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role !== ROLES.PARTNER) {
            return res.status(400).json({ message: 'Can only approve partners' });
        }

        user.isApproved = true;
        user.approvalCode = null; // Clear the code after approval
        await user.save();

        res.json({ 
            message: 'Partner approved successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Reject partner (Admin only)
export const rejectPartner = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role !== ROLES.PARTNER) {
            return res.status(400).json({ message: 'Can only reject partners' });
        }

        user.isApproved = false;
        user.approvalCode = null; // Clear the code
        await user.save();

        res.json({ 
            message: 'Partner rejected',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create admin user (for initial setup)
export const createAdmin = async (req, res) => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'lafiray@admin.ma' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('lafiray@admin.ma', salt);

        // Create admin user
        const adminUser = new User({
            name: 'L\'Afiray Admin',
            email: 'lafiray@admin.ma',
            password: hashedPassword,
            role: ROLES.ADMIN,
            isApproved: true // Admin is automatically approved
        });

        await adminUser.save();

        res.status(201).json({
            message: 'Admin user created successfully',
            admin: {
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error during admin creation', error: err.message });
    }
};

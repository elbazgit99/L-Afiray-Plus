import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ROLES from '../Constants/UserRoles.js';
import { sendEmail } from '../Config/emailService.js'; 

// to help function generate a JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password, role, companyName, companyAddress, shippingAddress, phone } = req.body;

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
            phone // Phone is required for all roles
        };

        if (role === ROLES.PARTNER) {
            if (!companyName || !companyAddress) {
                return res.status(400).json({ message: 'Company name and address are required for partners' });
            }
            newUserFields.companyName = companyName;
            newUserFields.companyAddress = companyAddress;
            
            // Partners always start as unapproved and need moderator approval
            newUserFields.isApproved = false;
        } else if (role === ROLES.BUYER) {
            if (!shippingAddress) {
                return res.status(400).json({ message: 'Shipping address is required for buyers' });
            }
            newUserFields.shippingAddress = shippingAddress;
        } else if (role === ROLES.MODERATOR) {
            // Moderator specific fields can be added here if needed, or simply no additional fields
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
            isApproved: user.isApproved,
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

    console.log('Login attempt for email:', email);

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved
        });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Password verified successfully');

        // Check if partner is approved
        if (user.role === ROLES.PARTNER && !user.isApproved) {
            console.log('Partner login attempt - not approved:', user.email);
            return res.status(403).json({ 
                message: 'Your partner account is pending approval. Please wait for moderator approval before accessing the platform.',
                isApproved: false,
                role: user.role
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
            isApproved: user.isApproved,
        };

        console.log('Login successful, sending response:', responseData);

        res.status(200).json(responseData);

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

// --- Existing User CRUD functions (will be protected by middleware in routes) ---

// Get all users (Moderator only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user by ID (Moderator or User themselves)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Allow user to fetch their own profile, or moderator to fetch any
        if (req.user.role !== ROLES.MODERATOR && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new user (Moderator only - for manual adding of partners by moderator)
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
            } else if (role === ROLES.MODERATOR) {
        // No additional fields specifically required for MODERATOR on creation
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

// Update user (Moderator or User themselves)
export const updateUser = async (req, res) => {
    const { name, email, password, role, companyName, companyAddress, shippingAddress, phone } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Authorization check: User can only update their own profile unless they are a MODERATOR
        if (req.user.role !== ROLES.MODERATOR && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
        }
        // Only Moderator can change role
        if (req.user.role !== ROLES.MODERATOR && role && role !== user.role) {
            return res.status(403).json({ message: 'Only moderators can change user roles.' });
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

// Delete user (Moderator only)
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all partners (Moderator only)
export const getPartners = async (req, res) => {
    try {
        const partners = await User.find({ role: ROLES.PARTNER }).select('-password');
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Approve partner (Moderator only)
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

        // Send approval email notification
        try {
            await sendEmail(user.email, 'partnerApproved', {
                partnerName: user.name,
                companyName: user.companyName
            });
            console.log('Approval email sent to:', user.email);
        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
            // Don't fail the approval process if email fails
        }

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

// Reject partner (Moderator only)
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

        // Send rejection email notification
        try {
            await sendEmail(user.email, 'partnerRejected', {
                partnerName: user.name,
                companyName: user.companyName
            });
            console.log('Rejection email sent to:', user.email);
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
            // Don't fail the rejection process if email fails
        }

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

// Create moderator user (for initial setup)
export const createModerator = async (req, res) => {
    try {
        // Check if moderator already exists
        const existingModerator = await User.findOne({ email: 'lafiray@moderator.ma' });
        if (existingModerator) {
            return res.status(400).json({ 
                message: 'Moderator user already exists',
                exists: true,
                moderator: {
                    _id: existingModerator._id,
                    name: existingModerator.name,
                    email: existingModerator.email,
                    role: existingModerator.role
                }
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('lafiray@moderator.ma', salt);

        // Create moderator user
        const moderatorUser = new User({
            name: 'L\'Afiray Moderator',
            email: 'lafiray@moderator.ma',
            password: hashedPassword,
            role: ROLES.MODERATOR,
            phone: '+2125 000 00000', // Default phone number for moderator
            isApproved: true // Moderator is automatically approved
        });

        await moderatorUser.save();

        res.status(201).json({
            message: 'Moderator user created successfully',
            created: true,
            moderator: {
                _id: moderatorUser._id,
                name: moderatorUser.name,
                email: moderatorUser.email,
                role: moderatorUser.role
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error during moderator creation', error: err.message });
    }
};

// Initialize moderator account (public endpoint for first-time setup)
export const initializeModerator = async (req, res) => {
    try {
        // Check if any moderator exists
        const existingModerator = await User.findOne({ role: ROLES.MODERATOR });
        
        if (existingModerator) {
            return res.status(200).json({
                message: 'Moderator already exists',
                exists: true,
                credentials: {
                    email: 'lafiray@moderator.ma',
                    password: 'lafiray@moderator.ma'
                }
            });
        }

        // Create moderator if none exists
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('lafiray@moderator.ma', salt);

        const moderatorUser = new User({
            name: 'L\'Afiray Moderator',
            email: 'lafiray@moderator.ma',
            password: hashedPassword,
            role: ROLES.MODERATOR,
            phone: '+2125 000 00000', // Default phone number for moderator
            isApproved: true
        });

        await moderatorUser.save();

        res.status(201).json({
            message: 'Moderator account created successfully!',
            created: true,
            credentials: {
                email: 'lafiray@moderator.ma',
                password: 'lafiray@moderator.ma'
            }
        });

    } catch (err) {
        console.error('Error initializing moderator:', err);
        res.status(500).json({ 
            message: 'Failed to initialize moderator account', 
            error: err.message 
        });
    }
};

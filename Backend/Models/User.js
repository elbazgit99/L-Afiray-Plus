import mongoose from 'mongoose';
import ROLES from '../Constants/UserRoles.js'; // Adjust path as necessary

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: [ROLES.PARTNER, ROLES.BUYER , ROLES.MODERATOR], // Using the constants here
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true // whitespace characters will be automatically removed from the string before it is saved to the DB.
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    // Partner-specific fields
    companyName: {
        type: String,
        required: function() { return this.role === ROLES.PARTNER; }
    },
    companyAddress: {
        type: String,
        required: function() { return this.role === ROLES.PARTNER; }
    },
    // Buyer-specific fields
    // shippingAddress: {
    //     type: String,
    //     required: function() { return this.role === ROLES.BUYER; }
    // },
    phone: {
        type: String,
        required : [true , "phone number is required"]
    },
    // Partner approval fields
    isApproved: {
        type: Boolean,
        default: false
    },
    // approvalCode: {
    //     type: String,
    //     default: null
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;
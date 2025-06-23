import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
     role: {
          type: String,
          enum: ['partner', 'buyer'],
          required: true
     },
     name: {
          type: String,
          required: true,
          trim: true
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
          required: function() { return this.role === 'partner'; }
     },
     companyAddress: {
          type: String,
          required: function() { return this.role === 'partner'; }
     },
     // Buyer-specific fields
     shippingAddress: {
          type: String,
          required: function() { return this.role === 'buyer'; }
     },
     phone: {
          type: String
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
});

const User = mongoose.model('User', userSchema);

export default User;

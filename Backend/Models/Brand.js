import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: [2, 'Brand name must be at least 2 characters long']
  },
  imageUrl: {
    type: String,
    default: null
  },
  imageFilename: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Brand = mongoose.model('Brand', BrandSchema);

export default Brand; 
import mongoose from 'mongoose';

const CarModelSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Car model name is required'],
          trim: true,
          minlength: [1, 'Car model name must be at least 1 character long']
     },
     // Reference to the Producer document
     producer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producer', // Refers to the 'Producer' model
          required: [true, 'Producer ID is required for a car model']
     },
},
{ timestamps: true });

// Add a compound unique index to ensure model names are unique per producer
CarModelSchema.index({ name: 1, producer: 1 }, { unique: true });

const CarModel = mongoose.model('CarModel', CarModelSchema);

export default CarModel;

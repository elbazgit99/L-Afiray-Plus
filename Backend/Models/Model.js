import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          trim: true
     },
     brand: {
          type: String,
          required: true,
          trim: true
     },
     category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: true
     },
     year: {
          type: Number,
          required: true
     },
     fuelType: {
          type: String,
          enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
          required: true
     },
     transmission: {
          type: String,
          enum: ['Manual', 'Automatic'],
          required: true
     },
     seats: {
          type: Number,
          required: true
     },
     imageUrl: {
          type: String
     },
     pricePerDay: {
          type: Number,
          required: true
     }
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

export default Car;
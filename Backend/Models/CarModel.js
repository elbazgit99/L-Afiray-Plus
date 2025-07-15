import mongoose from 'mongoose';

const CarModelSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Car model name is required'],
          trim: true,
          minlength: [1, 'Car model name must be at least 1 character long']
     },
     engine: {
          type: String,
          trim: true,
          default: 'Not specified'
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
// This allows same model names for different producers (e.g., BMW X5 and Mercedes X5)
CarModelSchema.index(
     { name: 1, producer: 1 },
     { 
          unique: true,
          name: 'unique_model_per_producer'
     }
);

// Add pre-save middleware to handle duplicate key errors gracefully
CarModelSchema.pre('save', function(next) {
     // Check if this is a new document
     if (this.isNew) {
          // Check for existing model with same name and producer
          this.constructor.findOne({ name: this.name, producer: this.producer })
               .then(existingModel => {
                    if (existingModel) {
                         const error = new Error(`A model with the name "${this.name}" already exists for this producer.`);
                         error.name = 'ValidationError';
                         return next(error);
                    }
                    next();
               })
               .catch(next);
     } else {
          next();
     }
});

const CarModel = mongoose.model('CarModel', CarModelSchema);

export default CarModel;

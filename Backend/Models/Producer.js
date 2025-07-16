import mongoose from 'mongoose';

const ProducerSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          trim: true, // whitespace characters will be automatically removed from the string before it is saved to the DB.
          unique: true, // Ensures that each producer has a unique name avoid repetition
          set : (value) => value.toUpperCase(), // Automatically converts the name to uppercase before saving
          validate: { // Custom rule: name must only contain letters, numbers, spaces, and common brand characters
                validator: function(nameInput) {
                    return /^[A-Za-z0-9\s\-&.]+$/.test(nameInput); // Regex to check for letters, numbers, spaces, hyphens, ampersands, and dots
                },
                message: props => `${props.value} can only contain letters, numbers, spaces, hyphens, ampersands, and dots.` // Error message
            },
          minlength: [2, 'Producer name must be at least 2 characters long'],
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
},
{ timestamps: true }); // Adds createdAt and updatedAt fields automatically

const Producer = mongoose.model('Producer', ProducerSchema);

export default Producer;
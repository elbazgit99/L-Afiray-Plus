import Producer from '../Models/Producer.js';
import CarModel from '../Models/CarModel.js';

// Create a new producer
export const createProducer = async (req, res) => {
     try {
          console.log('Creating producer with data:', req.body);
          console.log('File upload:', req.file);
          
          const producerData = { ...req.body };
          
          // Set createdBy to the authenticated user's ID
          producerData.createdBy = req.user.id;
          
          // Handle image upload if present
          if (req.file) {
               producerData.imageUrl = `/uploads/${req.file.filename}`;
               producerData.imageFilename = req.file.filename;
               console.log('Image uploaded:', producerData.imageUrl);
          }
          
          console.log('Final producer data:', producerData);
          const producer = new Producer(producerData);
          await producer.save();
          console.log('Producer saved successfully:', producer);
          res.status(201).json(producer);
     } catch (err) {
          console.error('Error creating producer:', err);
          res.status(400).json({ error: err.message });
     }
};

// Get all producers
export const getAllProducers = async (req, res) => {
     try {
          const producers = await Producer.find();
          console.log('Fetched producers:', producers.length);
          if (producers.length > 0) {
               console.log('Sample producer:', {
                    name: producers[0].name,
                    id: producers[0]._id
               });
          } else {
               console.log('No producers found in database');
          }
          res.json(producers);
     } catch (err) {
          console.error('Error fetching producers:', err);
          res.status(500).json({ error: err.message });
     }
};

// Get a single producer by ID
export const getProducerById = async (req, res) => {
     try {
          const producer = await Producer.findById(req.params.id);
          if (!producer) return res.status(404).json({ error: 'Producer not found' });
          res.json(producer);
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

// Update a producer by ID
export const updateProducer = async (req, res) => {
     try {
          const producer = await Producer.findByIdAndUpdate(
               req.params.id,
               req.body,
               { new: true, runValidators: true }
          );
          if (!producer) return res.status(404).json({ error: 'Producer not found' });
          res.json(producer);
     } catch (err) {
          res.status(400).json({ error: err.message });
     }
};

// Delete a producer by ID
export const deleteProducer = async (req, res) => {
     try {
          const producer = await Producer.findByIdAndDelete(req.params.id);
          if (!producer) return res.status(404).json({ error: 'Producer not found' });
          res.json({ message: 'Producer deleted successfully' });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

// Delete all producers (admin/dev utility)
export const deleteAllProducers = async (req, res) => {
    try {
        const result = await Producer.deleteMany({});
        res.json({ message: 'All producers deleted', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all producers and their models (admin/dev utility)
export const deleteAllProducersAndModels = async (req, res) => {
    try {
        const deletedModels = await CarModel.deleteMany({});
        const deletedProducers = await Producer.deleteMany({});
        res.json({
            message: 'All producers and their models deleted',
            deletedProducers: deletedProducers.deletedCount,
            deletedModels: deletedModels.deletedCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
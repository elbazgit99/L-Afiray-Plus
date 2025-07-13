import Producer from '../Models/Producer.js';

// Create a new producer
export const createProducer = async (req, res) => {
     try {
          const producer = new Producer(req.body);
          await producer.save();
          res.status(201).json(producer);
     } catch (err) {
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
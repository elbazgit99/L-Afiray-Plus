import CarModel from '../Models/CarModel.js';

// Get all models
export const getAllModels = async (req, res) => {
    try {
        const models = await CarModel.find().populate('producer');
        console.log('Fetched car models:', models.length);
        if (models.length > 0) {
            console.log('Sample car model:', {
                name: models[0].name,
                engine: models[0].engine,
                producer: models[0].producer?.name
            });
        }
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get model by ID
export const getModelById = async (req, res) => {
    try {
        const model = await CarModel.findById(req.params.id).populate('producer');
        if (!model) return res.status(404).json({ message: 'Model not found' });
        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new model
export const createModel = async (req, res) => {
    try {
        console.log('Creating car model with data:', req.body);
        
        // Validate required fields
        const { name, producer, engine } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Car model name is required' });
        }
        
        if (!producer) {
            return res.status(400).json({ message: 'Producer ID is required' });
        }
        
        // Check if model already exists for this producer
        const existingModel = await CarModel.findOne({ 
            name: name.trim(), 
            producer: producer 
        });
        
        if (existingModel) {
            return res.status(400).json({ 
                message: `A model with the name "${name.trim()}" already exists for this producer.` 
            });
        }
        
        // Create new model
        const newModel = new CarModel({
            name: name.trim(),
            producer: producer,
            engine: engine || 'Not specified'
        });
        
        const savedModel = await newModel.save();
        console.log('Saved car model:', savedModel);
        
        // Populate producer information before sending response
        await savedModel.populate('producer', 'name');
        
        res.status(201).json(savedModel);
    } catch (error) {
        console.error('Error creating car model:', error);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'A model with this name already exists for this producer.' 
            });
        }
        
        res.status(400).json({ message: error.message });
    }
};

// Update model by ID
export const updateModel = async (req, res) => {
    try {
        console.log('Updating car model with data:', req.body);
        const updatedModel = await CarModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedModel) return res.status(404).json({ message: 'Model not found' });
        console.log('Updated car model:', updatedModel);
        res.status(200).json(updatedModel);
    } catch (error) {
        console.error('Error updating car model:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete model by ID
export const deleteModel = async (req, res) => {
    try {
        // FIX: Changed 'await Model.findByIdAndDelete' to 'await CarModel.findByIdAndDelete'
        const deletedModel = await CarModel.findByIdAndDelete(req.params.id);
        if (!deletedModel) return res.status(404).json({ message: 'Model not found' });
        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

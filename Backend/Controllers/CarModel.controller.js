import CarModel from '../Models/CarModel.js';

// Get all models
export const getAllModels = async (req, res) => {
    try {
        const models = await CarModel.find().populate('producer');
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
        // FIX: Changed 'new Model' to 'new CarModel'
        const newModel = new CarModel(req.body);
        const savedModel = await newModel.save();
        res.status(201).json(savedModel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update model by ID
export const updateModel = async (req, res) => {
    try {
        const updatedModel = await CarModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedModel) return res.status(404).json({ message: 'Model not found' });
        res.status(200).json(updatedModel);
    } catch (error) {
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

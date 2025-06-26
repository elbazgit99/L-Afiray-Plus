import CarPart from '../Models/CarParts.js';

import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// Get all car parts
export const getAllCarParts = async (req, res) => {    
    try {
        const carParts = await CarPart.find().populate('carModel').populate('producer');
        res.json(carParts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single car part by ID
export const getCarPartById = async (req, res) => {
    try {
        const carPart = await CarPart.findById(req.params.id).populate('carModel').populate('producer');
        if (!carPart) return res.status(404).json({ error: 'Car part not found' });
        res.json(carPart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new car part
export const createCarPart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, carModel, producer } = req.body;

        // Validate carModel and producer
        if (!mongoose.Types.ObjectId.isValid(carModel)) {
            return res.status(400).json({ error: 'Invalid car model ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(producer)) {
            return res.status(400).json({ error: 'Invalid producer ID' });
        }

        const newCarPart = new CarPart({
            name,
            carModel,
            producer
        });

        await newCarPart.save();
        res.status(201).json(newCarPart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// Update a car part by ID
export const updateCarPart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, carModel, producer } = req.body;

        // Validate carModel and producer
        if (!mongoose.Types.ObjectId.isValid(carModel)) {
            return res.status(400).json({ error: 'Invalid car model ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(producer)) {
            return res.status(400).json({ error: 'Invalid producer ID' });
        }

        const updatedCarPart = await CarPart.findByIdAndUpdate(
            req.params.id,
            { name, carModel, producer },
            { new: true, runValidators: true }
        );

        if (!updatedCarPart) return res.status(404).json({ error: 'Car part not found' });

        res.json(updatedCarPart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a car part by ID
export const deleteCarPart = async (req, res) => {
    try {
        const deletedCarPart = await CarPart.findByIdAndDelete(req.params.id);
        if (!deletedCarPart) return res.status(404).json({ error: 'Car part not found' });
        res.json({ message: 'Car part deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get car parts by car model ID
export const getCarPartsByCarModel = async (req, res) => {
     try {
          const carModelId = req.params.carModelId;
     
          // Validate carModelId
          if (!mongoose.Types.ObjectId.isValid(carModelId)) {
               return res.status(400).json({ error: 'Invalid car model ID' });
          }
     
          const carParts = await CarPart.find({ carModel: carModelId }).populate('carModel').populate('producer');
          if (carParts.length === 0) return res.status(404).json({ error: 'No car parts found for this model' });
     
          res.json(carParts);
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

// Get car parts by producer ID
export const getCarPartsByProducer = async (req, res) => {
    try {
        const producerId = req.params.producerId;

        // Validate producerId
        if (!mongoose.Types.ObjectId.isValid(producerId)) {
            return res.status(400).json({ error: 'Invalid producer ID' });
        }

        const carParts = await CarPart.find({ producer: producerId }).populate('carModel').populate('producer');
        if (carParts.length === 0) return res.status(404).json({ error: 'No car parts found for this producer' });

        res.json(carParts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
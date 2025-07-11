import CarPart from '../Models/CarParts.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

// Helper function to delete image file
const deleteImageFile = (filename) => {
    if (filename) {
        const filePath = path.join('uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted image file:', filename);
        }
    }
};

// Get all car parts
export const getAllCarParts = async (req, res) => {    
    try {
        const carParts = await CarPart.find().populate('model').populate('producer');
        console.log('Fetched car parts:', carParts.length);
        if (carParts.length > 0) {
            console.log('Sample car part with model:', {
                partName: carParts[0].name,
                modelName: carParts[0].model?.name,
                modelEngine: carParts[0].model?.engine
            });
        }
        res.json(carParts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single car part by ID
export const getCarPartById = async (req, res) => {
    try {
        const carPart = await CarPart.findById(req.params.id).populate('model').populate('producer');
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
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description, price, brand, compatibility, category, model, producer } = req.body;
        
        console.log('Creating car part with data:', {
            name, description, price, brand, compatibility, category, model, producer
        });
        console.log('File upload info:', req.file);

        // Validate model and producer
        if (!mongoose.Types.ObjectId.isValid(model)) {
            console.error('Invalid model ID:', model);
            return res.status(400).json({ error: 'Invalid car model ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(producer)) {
            console.error('Invalid producer ID:', producer);
            return res.status(400).json({ error: 'Invalid producer ID' });
        }

        // Handle image upload
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        // Create image URL and store filename
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        const imageFilename = req.file.filename;
        
        console.log('Image uploaded:', {
            filename: imageFilename,
            url: imageUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        });

        const newCarPart = new CarPart({
            name,
            description,
            imageUrl,
            imageFilename,
            price,
            brand,
            compatibility,
            category,
            model,
            producer
        });

        console.log('Saving car part:', newCarPart);
        await newCarPart.save();
        console.log('Car part saved successfully:', newCarPart._id);
        res.status(201).json(newCarPart);
    } catch (err) {
        console.error('Error creating car part:', err);
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
        const { name, description, price, brand, compatibility, category, model, producer } = req.body;

        // Validate model and producer
        if (!mongoose.Types.ObjectId.isValid(model)) {
            return res.status(400).json({ error: 'Invalid car model ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(producer)) {
            return res.status(400).json({ error: 'Invalid producer ID' });
        }

        // Handle image upload for updates
        let updateData = { name, description, price, brand, compatibility, category, model, producer };
        
        if (req.file) {
            // Get the current car part to delete old image
            const currentCarPart = await CarPart.findById(req.params.id);
            if (currentCarPart && currentCarPart.imageFilename) {
                deleteImageFile(currentCarPart.imageFilename);
            }
            
            // Create new image URL and filename
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            updateData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
            updateData.imageFilename = req.file.filename;
            
            console.log('Image updated:', {
                filename: req.file.filename,
                url: updateData.imageUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            });
        }

        const updatedCarPart = await CarPart.findByIdAndUpdate(
            req.params.id,
            updateData,
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
        
        // Delete the associated image file
        if (deletedCarPart.imageFilename) {
            deleteImageFile(deletedCarPart.imageFilename);
        }
        
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
     
          const carParts = await CarPart.find({ model: carModelId }).populate('model').populate('producer');
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
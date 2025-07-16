import Brand from '../Models/Brand.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

// Helper to delete image file
const deleteImageFile = (filename) => {
  if (filename) {
    const filePath = path.join('uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted image file:', filename);
    }
  }
};

// Create a new brand
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    // Check for duplicate
    const existing = await Brand.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'Brand with this name already exists' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    const imageFilename = req.file.filename;
    const createdBy = req.user._id;
    const newBrand = new Brand({
      name: name.trim(),
      imageUrl,
      imageFilename,
      createdBy
    });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    console.error('Error creating brand:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get brand by ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update brand
export const updateBrand = async (req, res) => {
  try {
    const { name } = req.body;
    let updateData = { name };
    if (req.file) {
      // Delete old image
      const currentBrand = await Brand.findById(req.params.id);
      if (currentBrand && currentBrand.imageFilename) {
        deleteImageFile(currentBrand.imageFilename);
      }
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updateData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      updateData.imageFilename = req.file.filename;
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedBrand) return res.status(404).json({ error: 'Brand not found' });
    res.json(updatedBrand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete brand
export const deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) return res.status(404).json({ error: 'Brand not found' });
    if (deletedBrand.imageFilename) {
      deleteImageFile(deletedBrand.imageFilename);
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
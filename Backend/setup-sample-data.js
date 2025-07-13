import mongoose from 'mongoose';
import Producer from './Models/Producer.js';
import CarModel from './Models/CarModel.js';
import CarPart from './Models/CarParts.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/lafiray-app');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample data
const sampleProducers = [
    { name: 'BMW' },
    { name: 'Mercedes Benz' },
    { name: 'Audi' },
    { name: 'Volkswagen' },
    { name: 'Toyota' },
    { name: 'Honda' }
];

const sampleCarModels = [
    { name: 'X1', engine: 'Petrol', producer: null }, // Will be set after producer creation
    { name: 'X3', engine: 'Diesel', producer: null },
    { name: 'C-Class', engine: 'Petrol', producer: null },
    { name: 'E-Class', engine: 'Diesel', producer: null },
    { name: 'A4', engine: 'Petrol', producer: null },
    { name: 'Q5', engine: 'Diesel', producer: null },
    { name: 'Golf', engine: 'Petrol', producer: null },
    { name: 'Passat', engine: 'Diesel', producer: null },
    { name: 'Camry', engine: 'Petrol', producer: null },
    { name: 'Civic', engine: 'Petrol', producer: null }
];

const sampleCarParts = [
    {
        name: 'Air Filter',
        description: 'High-quality air filter for optimal engine performance',
        price: 45.99,
        brand: 'Bosch',
        category: 'Engine',
        compatibility: 'Universal',
        imageUrl: 'http://localhost:5000/uploads/carpart-1751819571615-546164139.webp',
        imageFilename: 'carpart-1751819571615-546164139.webp',
        model: null, // Will be set after model creation
        producer: null // Will be set after producer creation
    },
    {
        name: 'Spark Plugs',
        description: 'Premium spark plugs for better ignition',
        price: 89.99,
        brand: 'NGK',
        category: 'Engine',
        compatibility: 'Universal',
        imageUrl: 'http://localhost:5000/uploads/carpart-1751819947087-451488388.webp',
        imageFilename: 'carpart-1751819947087-451488388.webp',
        model: null,
        producer: null
    },
    {
        name: 'Brake Pads',
        description: 'High-performance brake pads for safety',
        price: 120.50,
        brand: 'Brembo',
        category: 'Brakes',
        compatibility: 'Universal',
        imageUrl: 'http://localhost:5000/uploads/carpart-1751820128628-269595950.webp',
        imageFilename: 'carpart-1751820128628-269595950.webp',
        model: null,
        producer: null
    },
    {
        name: 'Oil Filter',
        description: 'Quality oil filter for engine protection',
        price: 35.99,
        brand: 'Mann',
        category: 'Engine',
        compatibility: 'Universal',
        imageUrl: 'http://localhost:5000/uploads/carpart-1751820178954-655634829.webp',
        imageFilename: 'carpart-1751820178954-655634829.webp',
        model: null,
        producer: null
    },
    {
        name: 'Timing Belt',
        description: 'Durable timing belt for engine synchronization',
        price: 180.00,
        brand: 'Gates',
        category: 'Engine',
        compatibility: 'Universal',
        imageUrl: 'http://localhost:5000/uploads/carpart-1751820315567-381491722.webp',
        imageFilename: 'carpart-1751820315567-381491722.webp',
        model: null,
        producer: null
    }
];

const setupSampleData = async () => {
    try {
        console.log('Starting sample data setup...');

        // Clear existing data
        await CarPart.deleteMany({});
        await CarModel.deleteMany({});
        await Producer.deleteMany({});
        console.log('Cleared existing data');

        // Create producers
        console.log('Creating producers...');
        const createdProducers = [];
        for (const producerData of sampleProducers) {
            const producer = new Producer(producerData);
            const savedProducer = await producer.save();
            createdProducers.push(savedProducer);
            console.log(`Created producer: ${savedProducer.name}`);
        }

        // Create car models (assigning to producers in round-robin fashion)
        console.log('Creating car models...');
        const createdModels = [];
        for (let i = 0; i < sampleCarModels.length; i++) {
            const modelData = { ...sampleCarModels[i] };
            modelData.producer = createdProducers[i % createdProducers.length]._id;
            
            const model = new CarModel(modelData);
            const savedModel = await model.save();
            createdModels.push(savedModel);
            console.log(`Created model: ${savedModel.name} for producer: ${createdProducers[i % createdProducers.length].name}`);
        }

        // Create car parts (assigning to models in round-robin fashion)
        console.log('Creating car parts...');
        for (let i = 0; i < sampleCarParts.length; i++) {
            const partData = { ...sampleCarParts[i] };
            partData.model = createdModels[i % createdModels.length]._id;
            partData.producer = createdModels[i % createdModels.length].producer;
            
            const part = new CarPart(partData);
            const savedPart = await part.save();
            console.log(`Created car part: ${savedPart.name} for model: ${createdModels[i % createdModels.length].name}`);
        }

        console.log('Sample data setup completed successfully!');
        console.log(`Created ${createdProducers.length} producers`);
        console.log(`Created ${createdModels.length} car models`);
        console.log(`Created ${sampleCarParts.length} car parts`);

    } catch (error) {
        console.error('Error setting up sample data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
};

// Run the setup
connectDB().then(() => {
    setupSampleData();
}); 
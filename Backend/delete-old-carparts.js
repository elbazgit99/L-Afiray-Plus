import mongoose from 'mongoose';
import CarPart from './Models/CarParts.js';
import dotenv from 'dotenv';

dotenv.config({ path: './Config/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lafiray';

async function deleteOldCarParts() {
  await mongoose.connect(MONGO_URI);
  const result = await CarPart.deleteMany({ $or: [ { producer: null }, { model: null } ] });
  console.log(`Deleted ${result.deletedCount} car parts with null producer or model.`);
  await mongoose.disconnect();
}

deleteOldCarParts().catch(err => {
  console.error('Error deleting old car parts:', err);
  process.exit(1);
}); 
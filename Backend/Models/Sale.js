import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  partId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarPart', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', SaleSchema);
export default Sale; 
import Sale from '../Models/Sale.js';
import CarPart from '../Models/CarParts.js'; // Ensure CarPart is imported

// POST /api/sales
export const createSale = async (req, res) => {
  try {
    const { partId, buyerId, price } = req.body;
    if (!partId || !buyerId || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch the CarPart to get the correct partnerId
    const carPart = await CarPart.findById(partId);
    if (!carPart) {
      return res.status(404).json({ error: 'Car part not found' });
    }
    const partnerId = carPart.producer;

    const sale = new Sale({ partId, buyerId, partnerId, price });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/sales/partner/:partnerId
export const getSalesByPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const sales = await Sale.find({ partnerId }).populate('partId').populate('buyerId');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
import Sale from '../Models/Sale.js';

// POST /api/sales
export const createSale = async (req, res) => {
  try {
    const { partId, buyerId, partnerId, price } = req.body;
    if (!partId || !buyerId || !partnerId || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
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
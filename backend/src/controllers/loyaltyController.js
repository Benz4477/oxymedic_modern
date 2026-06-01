import Loyalty from '../models/Loyalty.js';

export const getAllLoyalty = async (req, res) => {
  try {
    const loyalty = await Loyalty.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: loyalty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoyaltyByClient = async (req, res) => {
  try {
    const loyalty = await Loyalty.findOne({ client: req.params.clientId });
    if (!loyalty) return res.status(404).json({ success: false, message: 'Carte non trouvée' });
    res.json({ success: true, data: loyalty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLoyaltyCard = async (req, res) => {
  try {
    const loyalty = new Loyalty(req.body);
    const newLoyalty = await loyalty.save();
    res.status(201).json({ success: true, data: newLoyalty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addPoints = async (req, res) => {
  try {
    const { clientId, points, reason } = req.body;
    const loyalty = await Loyalty.findOne({ client: clientId });
    if (!loyalty) return res.status(404).json({ success: false, message: 'Carte non trouvée' });
    
    loyalty.points += points;
    loyalty.history.push({ type: 'earn', points, reason, date: new Date() });
    await loyalty.save();
    res.json({ success: true, data: loyalty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const usePoints = async (req, res) => {
  try {
    const { clientId, points, reason } = req.body;
    const loyalty = await Loyalty.findOne({ client: clientId });
    if (!loyalty) return res.status(404).json({ success: false, message: 'Carte non trouvée' });
    
    if (loyalty.points < points) {
      return res.status(400).json({ success: false, message: 'Points insuffisants' });
    }
    
    loyalty.points -= points;
    loyalty.history.push({ type: 'redeem', points, reason, date: new Date() });
    await loyalty.save();
    res.json({ success: true, data: loyalty });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLoyaltyCard = async (req, res) => {
  try {
    const loyalty = await Loyalty.findByIdAndDelete(req.params.id);
    if (!loyalty) return res.status(404).json({ success: false, message: 'Carte non trouvée' });
    res.json({ success: true, message: 'Carte supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoyaltyStats = async (req, res) => {
  try {
    const cards = await Loyalty.find({});
    let totalPoints = 0;
    let totalSpent = 0;
    let byTier = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
    
    cards.forEach(card => {
      totalPoints += card.points || 0;
      totalSpent += card.totalSpent || 0;
      const tier = card.tier || 'bronze';
      byTier[tier] = (byTier[tier] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalCards: cards.length,
        totalPoints,
        totalSpent,
        byTier
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

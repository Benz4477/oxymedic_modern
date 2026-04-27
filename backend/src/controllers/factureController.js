// backend/src/controllers/factureController.js
import Facture from '../models/Facture.js';

// @desc    Récupérer toutes les factures
// @route   GET /api/factures
// @access  Private
export const getAllFactures = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, clientId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (clientId) filter.clientId = parseInt(clientId);
    
    const factures = await Facture.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Facture.countDocuments(filter);
    
    res.json({
      success: true,
      data: factures,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des factures',
      error: error.message
    });
  }
};

// @desc    Récupérer une facture par son ID
// @route   GET /api/factures/:id
// @access  Private
export const getFactureById = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    
    if (!facture) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: facture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la facture',
      error: error.message
    });
  }
};

// @desc    Créer une nouvelle facture
// @route   POST /api/factures
// @access  Private
export const createFacture = async (req, res) => {
  try {
    console.log("=== CRÉATION FACTURE ===");
    console.log("Body reçu:", req.body);
    
    const { type = 'facture' } = req.body;
    console.log("Type extrait:", type);
    
    // Générer le numéro automatiquement
    const num = await Facture.getNextNumero(type);
    console.log("Numéro généré:", num);
    
    const factureData = {
      ...req.body,
      num,
      createdBy: req.user?.name || 'System'
    };
    console.log("Données complètes:", factureData);
    
    const facture = new Facture(factureData);
    console.log("Instance Facture créée");
    
    const savedFacture = await facture.save();
    console.log("Facture sauvegardée:", savedFacture);
    
    res.status(201).json({
      success: true,
      data: savedFacture,
      message: 'Facture créée avec succès'
    });
  } catch (error) {
    console.error("=== ERREUR CRÉATION FACTURE ===");
    console.error("Type d'erreur:", error.name);
    console.error("Message d'erreur:", error.message);
    console.error("Détails:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ce numéro de facture existe déjà'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la facture',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une facture
// @route   PUT /api/factures/:id
// @access  Private
export const updateFacture = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    
    if (!facture) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }
    
    // Empêcher la modification si déjà payée
    if (facture.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une facture déjà payée'
      });
    }
    
    const updatedFacture = await Facture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedFacture,
      message: 'Facture mise à jour avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la facture',
      error: error.message
    });
  }
};

// @desc    Supprimer une facture
// @route   DELETE /api/factures/:id
// @access  Private
export const deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    
    if (!facture) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }
    
    // Empêcher la suppression si déjà payée
    if (facture.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une facture déjà payée'
      });
    }
    
    await Facture.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Facture supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la facture',
      error: error.message
    });
  }
};

// @desc    Marquer une facture comme payée
// @route   POST /api/factures/:id/pay
// @access  Private
export const markAsPaid = async (req, res) => {
  try {
    const { montant, modePaiement } = req.body;
    
    const facture = await Facture.findById(req.params.id);
    
    if (!facture) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }
    
    if (facture.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Facture déjà payée'
      });
    }
    
    await facture.markAsPaid(montant, modePaiement);
    
    res.json({
      success: true,
      data: facture,
      message: 'Paiement enregistré avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du paiement',
      error: error.message
    });
  }
};

// @desc    Archiver une facture
// @route   POST /api/factures/:id/archive
// @access  Private
export const archiveFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    
    if (!facture) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: facture,
      message: 'Facture archivée avec succès'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'archivage de la facture',
      error: error.message
    });
  }
};

// @desc    Obtenir le prochain numéro de facture
// @route   GET /api/factures/next-number/:type
// @access  Private
export const getNextNumero = async (req, res) => {
  try {
    const { type = 'facture' } = req.params;
    const numero = await Facture.getNextNumero(type);
    
    res.json({
      success: true,
      data: { numero }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du numéro',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques des factures
// @route   GET /api/factures/stats
// @access  Private
export const getFactureStats = async (req, res) => {
  try {
    const stats = await Facture.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHT: { $sum: '$montantHT' },
          totalTTC: { $sum: '$montantTTC' },
          totalPaye: { $sum: '$montantPaye' }
        }
      }
    ]);
    
    const totalFactures = await Facture.countDocuments();
    const totalEnRetard = await Facture.countDocuments({
      status: { $in: ['sent', 'unpaid', 'partial'] },
      dateEcheance: { $lt: new Date().toLocaleDateString('fr-FR') }
    });
    
    res.json({
      success: true,
      data: {
        byStatus: stats,
        totalFactures,
        totalEnRetard
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

import Devis from '../models/Devis.js';

// @desc    Récupérer tous les devis
// @route   GET /api/devis
// @access  Private
export const getAllDevis = async (req, res) => {
  try {
    console.log("=== RÉCUPÉRATION DES DEVIS ===");
    
    const { status, clientId, archived = false } = req.query;
    let filter = { archived };
    
    if (status) filter.status = status;
    if (clientId) filter.clientId = parseInt(clientId);
    
    const devis = await Devis.find(filter).sort({ id: -1 });
    
    console.log(`${devis.length} devis trouvés`);
    
    res.json({
      success: true,
      data: devis
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des devis'
    });
  }
};

// @desc    Récupérer un devis par son ID
// @route   GET /api/devis/:id
// @access  Private
export const getDevisById = async (req, res) => {
  try {
    console.log(`=== RÉCUPÉRATION DEVIS ID: ${req.params.id} ===`);
    
    const devis = await Devis.findOne({ id: parseInt(req.params.id) });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    console.log(`Devis trouvé: ${devis.reference}`);
    
    res.json({
      success: true,
      data: devis
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du devis:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du devis'
    });
  }
};

// @desc    Créer un nouveau devis
// @route   POST /api/devis
// @access  Private
export const createDevis = async (req, res) => {
  try {
    console.log("=== CRÉATION DEVIS ===");
    console.log("Body reçu:", req.body);
    
    const { type = 'devis' } = req.body;
    
    // Générer l'ID et la référence automatiquement
    const id = await Devis.getNextId();
    const reference = await Devis.getNextReference(type);
    
    const devisData = {
      ...req.body,
      id,
      reference,
      createdBy: req.user?.name || 'System'
    };
    
    console.log("Données complètes:", devisData);
    
    const devis = new Devis(devisData);
    const savedDevis = await devis.save();
    
    console.log(`Devis créé: ${savedDevis.reference}`);
    
    res.status(201).json({
      success: true,
      data: savedDevis,
      message: 'Devis créé avec succès'
    });
  } catch (error) {
    console.error("=== ERREUR CRÉATION DEVIS ===");
    console.error(error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Cette référence de devis existe déjà'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du devis',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un devis
// @route   PUT /api/devis/:id
// @access  Private
export const updateDevis = async (req, res) => {
  try {
    console.log(`=== MISE À JOUR DEVIS ID: ${req.params.id} ===`);
    console.log("Body reçu:", req.body);
    
    const devis = await Devis.findOne({ id: parseInt(req.params.id) });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    // Vérifier si le devis peut être modifié
    if (devis.status === 'accepted' || devis.status === 'converted') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier un devis accepté ou converti'
      });
    }
    
    const updatedDevis = await Devis.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { 
        ...req.body, 
        updatedBy: req.user?.name || 'System'
      },
      { new: true, runValidators: true }
    );
    
    console.log(`Devis mis à jour: ${updatedDevis.reference}`);
    
    res.json({
      success: true,
      data: updatedDevis,
      message: 'Devis mis à jour avec succès'
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis:", error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du devis',
      error: error.message
    });
  }
};

// @desc    Supprimer un devis
// @route   DELETE /api/devis/:id
// @access  Private
export const deleteDevis = async (req, res) => {
  try {
    console.log(`=== SUPPRESSION DEVIS ID: ${req.params.id} ===`);
    
    const devis = await Devis.findOne({ id: parseInt(req.params.id) });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    // Vérifier si le devis peut être supprimé
    if (devis.status === 'accepted' || devis.status === 'converted') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer un devis accepté ou converti'
      });
    }
    
    await Devis.findOneAndDelete({ id: parseInt(req.params.id) });
    
    console.log(`Devis supprimé: ${devis.reference}`);
    
    res.json({
      success: true,
      message: 'Devis supprimé avec succès'
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du devis:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du devis'
    });
  }
};

// @desc    Envoyer un devis
// @route   PUT /api/devis/:id/send
// @access  Private
export const sendDevis = async (req, res) => {
  try {
    console.log(`=== ENVOI DEVIS ID: ${req.params.id} ===`);
    
    const devis = await Devis.findOne({ id: parseInt(req.params.id) });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    if (devis.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les devis en brouillon peuvent être envoyés'
      });
    }
    
    const updatedDevis = await Devis.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { 
        status: 'sent',
        dateEnvoi: new Date().toLocaleDateString('fr-FR'),
        envoyePar: req.user?.name || 'System',
        updatedBy: req.user?.name || 'System'
      },
      { new: true }
    );
    
    console.log(`Devis envoyé: ${updatedDevis.reference}`);
    
    res.json({
      success: true,
      data: updatedDevis,
      message: 'Devis envoyé avec succès'
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du devis:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du devis'
    });
  }
};

// @desc    Accepter un devis
// @route   PUT /api/devis/:id/accept
// @access  Private
export const acceptDevis = async (req, res) => {
  try {
    console.log(`=== ACCEPTATION DEVIS ID: ${req.params.id} ===`);
    
    const devis = await Devis.findOne({ id: parseInt(req.params.id) });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    if (devis.status !== 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les devis envoyés peuvent être acceptés'
      });
    }
    
    const updatedDevis = await Devis.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { 
        status: 'accepted',
        dateAcceptation: new Date().toLocaleDateString('fr-FR'),
        acceptePar: req.user?.name || 'System',
        updatedBy: req.user?.name || 'System'
      },
      { new: true }
    );
    
    console.log(`Devis accepté: ${updatedDevis.reference}`);
    
    res.json({
      success: true,
      data: updatedDevis,
      message: 'Devis accepté avec succès'
    });
  } catch (error) {
    console.error("Erreur lors de l'acceptation du devis:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'acceptation du devis'
    });
  }
};

// @desc    Convertir un devis en commande
// @route   POST /api/devis/:id/convert
// @access  Private
export const convertDevis = async (req, res) => {
  try {
    console.log(`=== CONVERSION DEVIS ID: ${req.params.id} ===`);
    
    const devis = await Devis.findOne({ id: parseInt(req.params.id) });
    
    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Devis non trouvé'
      });
    }
    
    if (devis.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les devis acceptés peuvent être convertis'
      });
    }
    
    // Ici vous pourriez créer une commande à partir du devis
    // Pour l'instant, on marque juste comme converti
    const cmdRef = `CMD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const updatedDevis = await Devis.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { 
        status: 'converted',
        convertedToCmdRef: cmdRef,
        updatedBy: req.user?.name || 'System'
      },
      { new: true }
    );
    
    console.log(`Devis converti: ${updatedDevis.reference} -> ${cmdRef}`);
    
    res.json({
      success: true,
      data: updatedDevis,
      cmdRef,
      message: 'Devis converti en commande avec succès'
    });
  } catch (error) {
    console.error("Erreur lors de la conversion du devis:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la conversion du devis'
    });
  }
};

// @desc    Obtenir les statistiques des devis
// @route   GET /api/devis/stats
// @access  Private
export const getDevisStats = async (req, res) => {
  try {
    console.log("=== STATISTIQUES DEVIS ===");
    
    const total = await Devis.countDocuments({ archived: false });
    const draft = await Devis.countDocuments({ status: 'draft', archived: false });
    const sent = await Devis.countDocuments({ status: 'sent', archived: false });
    const accepted = await Devis.countDocuments({ status: 'accepted', archived: false });
    const rejected = await Devis.countDocuments({ status: 'rejected', archived: false });
    const expired = await Devis.countDocuments({ status: 'expired', archived: false });
    const converted = await Devis.countDocuments({ status: 'converted', archived: false });
    
    // Calcul du montant total des devis
    const montants = await Devis.aggregate([
      { $match: { archived: false } },
      { $group: { _id: null, total: { $sum: '$montantTTC' } } }
    ]);
    
    const stats = {
      total,
      draft,
      sent,
      accepted,
      rejected,
      expired,
      converted,
      totalAmount: montants[0]?.total || 0,
      conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0
    };
    
    console.log("Statistiques:", stats);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

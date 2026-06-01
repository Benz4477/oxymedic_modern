// backend/controllers/cautionController.js
import Caution from '../models/Caution.js';
import Commande from '../models/Commande.js';

const POPULATE = [
  { path: 'client', select: 'prenom nom tel quartier adresse cinNum email' },
  { path: 'commande', select: 'reference status start end' },
  { path: 'equipement', select: 'name icon cat ref caution photo' },
  { path: 'unite', select: 'serial barcode statut etat' },
  { path: 'saisiePar', select: 'name username' },
  { path: 'restituePar', select: 'name username' },
];

// Générer la prochaine référence CAU-YYYY-XXXX
export async function generateRef() {
  const year = new Date().getFullYear();
  const prefix = `CAU-${year}-`;
  const last = await Caution.findOne({ ref: new RegExp(`^${prefix}`) })
    .sort({ ref: -1 })
    .select('ref');
  let num = 1;
  if (last) {
    const match = last.ref.match(/-(\d+)$/);
    if (match) num = parseInt(match[1]) + 1;
  }
  return `${prefix}${String(num).padStart(4, '0')}`;
}

// GET /api/cautions — liste avec filtres
export const getAll = async (req, res) => {
  try {
    const { status, client, commande, search } = req.query;
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    if (status) filter.status = status;
    if (client) filter.client = client;
    if (commande) filter.commande = commande;

    let cautions = await Caution.find(filter).populate(POPULATE).sort({ date: -1 });

    // Recherche texte (post-populate)
    if (search) {
      const q = search.toLowerCase();
      cautions = cautions.filter((c) => {
        const clientName = c.client
          ? `${c.client.prenom || ''} ${c.client.nom || ''}`.toLowerCase()
          : '';
        const cmdRef = c.commande?.ref?.toLowerCase() || '';
        const ref = c.ref?.toLowerCase() || '';
        return clientName.includes(q) || cmdRef.includes(q) || ref.includes(q);
      });
    }

    res.json(cautions);
  } catch (err) {
    console.error('[cautionController.getAll]', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/cautions/stats — KPIs
export const getStats = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const all = await Caution.find(filter);
    const stats = {
      total: all.reduce((a, c) => a + c.amount, 0),
      held: all
        .filter((c) => c.status === 'held')
        .reduce((a, c) => a + c.amount, 0),
      returned: all
        .filter((c) => c.status === 'returned')
        .reduce((a, c) => a + c.amount, 0),
      deducted: all
        .filter((c) => c.status === 'deducted')
        .reduce((a, c) => a + c.amount, 0),
      count: all.length,
      countHeld: all.filter((c) => c.status === 'held').length,
      countReturned: all.filter((c) => c.status === 'returned').length,
      countDeducted: all.filter((c) => c.status === 'deducted').length,
    };
    res.json(stats);
  } catch (err) {
    console.error('[cautionController.getStats]', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/cautions/:id
export const getById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;

    const caution = await Caution.findOne(filter).populate(POPULATE);
    if (!caution) return res.status(404).json({ message: 'Caution introuvable ou accès non autorisé' });
    res.json(caution);
  } catch (err) {
    console.error('[cautionController.getById]', err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cautions — création manuelle
export const create = async (req, res) => {
  try {
    const {
      client,
      commande,
      equipement,
      unite,
      amount,
      mode,
      numeroChèque,
      banque,
      date,
      note,
    } = req.body;

    if (!client) return res.status(400).json({ message: 'Client requis' });
    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Montant invalide' });

    const ref = await generateRef();

    const caution = await Caution.create({
      ref,
      client,
      magasin: req.magasinId, // Liaison magasin
      commande: commande || null,
      equipement: equipement || null,
      unite: unite || null,
      amount,
      mode: mode || 'Cash',
      numeroChèque: numeroChèque || '',
      banque: banque || '',
      date: date || Date.now(),
      note: note || '',
      saisiePar: req.user?._id || null,
      status: 'held',
    });

    // Si liée à une commande, mettre à jour la commande
    if (commande) {
      await Commande.findByIdAndUpdate(commande, { caution: caution._id });
    }

    const populated = await Caution.findById(caution._id).populate(POPULATE);
    res.status(201).json(populated);
  } catch (err) {
    console.error('[cautionController.create]', err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cautions/:id — édition générale
export const update = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;

    const caution = await Caution.findOne(filter);
    if (!caution) return res.status(404).json({ message: 'Caution introuvable ou accès non autorisé' });

    // Empêcher la modification du montant si déjà restituée/déduite
    if (caution.status !== 'held' && req.body.amount !== undefined) {
      return res.status(400).json({
        message: 'Impossible de modifier le montant d\'une caution déjà restituée ou déduite',
      });
    }

    const allowedFields = [
      'amount',
      'mode',
      'numeroChèque',
      'banque',
      'date',
      'note',
      'equipement',
      'unite',
    ];
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) caution[f] = req.body[f];
    });

    await caution.save();
    const populated = await Caution.findById(caution._id).populate(POPULATE);
    res.json(populated);
  } catch (err) {
    console.error('[cautionController.update]', err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/cautions/:id/return — restituer
export const returnCaution = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;

    const caution = await Caution.findOne(filter);
    if (!caution) return res.status(404).json({ message: 'Caution introuvable ou accès non autorisé' });

    if (caution.status !== 'held')
      return res
        .status(400)
        .json({ message: 'Cette caution a déjà été traitée' });

    caution.status = 'returned';
    caution.retourDate = req.body.retourDate || Date.now();
    caution.restituePar = req.user?._id || null;
    if (req.body.note) caution.note = req.body.note;

    await caution.save();
    const populated = await Caution.findById(caution._id).populate(POPULATE);
    res.json(populated);
  } catch (err) {
    console.error('[cautionController.returnCaution]', err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/cautions/:id/deduct — déduire (partiellement ou totalement)
export const deductCaution = async (req, res) => {
  try {
    const { deductionAmount, deductionReason } = req.body;
    if (!deductionAmount || deductionAmount <= 0)
      return res.status(400).json({ message: 'Montant de déduction invalide' });

    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;

    const caution = await Caution.findOne(filter);
    if (!caution) return res.status(404).json({ message: 'Caution introuvable ou accès non autorisé' });

    if (caution.status !== 'held')
      return res
        .status(400)
        .json({ message: 'Cette caution a déjà été traitée' });
    if (deductionAmount > caution.amount)
      return res
        .status(400)
        .json({ message: 'La déduction dépasse le montant de la caution' });

    caution.status = 'deducted';
    caution.deductionAmount = deductionAmount;
    caution.deductionReason = deductionReason || '';
    caution.retourDate = req.body.retourDate || Date.now();
    caution.restituePar = req.user?._id || null;

    await caution.save();
    const populated = await Caution.findById(caution._id).populate(POPULATE);
    res.json(populated);
  } catch (err) {
    console.error('[cautionController.deductCaution]', err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/cautions/:id/cancel — annuler une restitution/déduction (revenir à held)
export const cancel = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;

    const caution = await Caution.findOne(filter);
    if (!caution) return res.status(404).json({ message: 'Caution introuvable ou accès non autorisé' });

    if (caution.status === 'held')
      return res.status(400).json({ message: 'Caution déjà en cours' });

    caution.status = 'held';
    caution.retourDate = null;
    caution.deductionAmount = 0;
    caution.deductionReason = '';
    caution.restituePar = null;

    await caution.save();
    const populated = await Caution.findById(caution._id).populate(POPULATE);
    res.json(populated);
  } catch (err) {
    console.error('[cautionController.cancel]', err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cautions/:id — admin only
export const remove = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;

    const caution = await Caution.findOne(filter);
    if (!caution) return res.status(404).json({ message: 'Caution introuvable ou accès non autorisé' });

    // Détacher de la commande si liée
    if (caution.commande) {
      await Commande.findByIdAndUpdate(caution.commande, { caution: null });
    }

    await caution.deleteOne();
    res.json({ message: 'Caution supprimée', id: req.params.id });
  } catch (err) {
    console.error('[cautionController.remove]', err);
    res.status(500).json({ message: err.message });
  }
};

// Helper exporté pour intégration depuis commandeController
export const createFromCommande = async (commande, cautionData, userId, session) => {
  const ref = await generateRef();
  const cautionArray = await Caution.create([{
    ref,
    client: commande.client,
    magasin: commande.magasin || null, // Hériter du magasin de la commande
    commande: commande._id,
    equipement: commande.equipement || null,
    unite: commande.unite || null,
    amount: cautionData.amount,
    mode: cautionData.mode || 'Cash',
    numeroChèque: cautionData.numeroChèque || '',
    banque: cautionData.banque || '',
    date: Date.now(),
    note: cautionData.note || '',
    saisiePar: userId || null,
    status: 'held',
  }], { session });

  return cautionArray[0];
};
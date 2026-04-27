import mongoose from "mongoose";

const ligneDevisSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  quantite: { type: Number, required: true, min: 1, default: 1 },
  prixHT: { type: Number, required: true, min: 0 },
  totalHT: { type: Number, required: true, min: 0 },
  equipId: { type: Number, default: null },        // lien vers équipement (optionnel)
  tvaRate: { type: Number, default: 20, min: 0, max: 100 },
  remPct: { type: Number, default: 0, min: 0, max: 100 },
}, { _id: false });

const devisSchema = new mongoose.Schema({
  // Identifiant numérique (comme dans l'original)
  id: { type: Number, required: true, unique: true },

  // Informations générales
  reference: { type: String, required: true, unique: true, trim: true },
  type: { type: String, required: true, enum: ['devis', 'proforma'], default: 'devis' },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'],
    default: 'draft'
  },

  // Client (référence par l'ID numérique original)
  clientId: { type: Number, required: true },

  // Dates
  date: { type: String, required: true },                // format DD/MM/YYYY
  dateValidite: { type: String, required: true },        // format DD/MM/YYYY
  dateEnvoi: { type: String, default: "" },              // format DD/MM/YYYY
  dateAcceptation: { type: String, default: "" },        // format DD/MM/YYYY

  // Commandes liées
  cmdRef: { type: String, default: "" },                 // commande générée
  convertedToCmdRef: { type: String, default: "" },      // référence de la commande convertie

  // Description et notes
  description: { type: String, default: "" },
  notes: { type: String, default: "" },

  // Lignes du devis
  lignes: [ligneDevisSchema],

  // Montants
  montantHT: { type: Number, required: true, default: 0 },
  montantTVA: { type: Number, required: true, default: 0 },
  montantTTC: { type: Number, required: true, default: 0 },
  remiseGlobale: { type: Number, default: 0, min: 0, max: 100 },
  tvaRate: { type: Number, default: 20, min: 0, max: 100 },

  // Suivi
  envoyePar: { type: String, default: "" },
  acceptePar: { type: String, default: "" },

  // Documents
  pdfPath: { type: String, default: "" },

  // Archivage
  archived: { type: Boolean, default: false },

  // Audit
  createdBy: { type: String, required: true },
  updatedBy: { type: String, default: "" },
}, {
  timestamps: true,
});

// Index pour optimiser les recherches
devisSchema.index({ id: 1 });
devisSchema.index({ reference: 1 });
devisSchema.index({ clientId: 1 });
devisSchema.index({ status: 1 });
devisSchema.index({ date: 1 });
devisSchema.index({ dateValidite: 1 });

// Méthode statique pour générer l'ID numérique auto-incrémenté
devisSchema.statics.getNextId = async function() {
  const lastDevis = await this.findOne().sort({ id: -1 });
  return lastDevis ? lastDevis.id + 1 : 1;
};

// Méthode statique pour générer la référence automatiquement
devisSchema.statics.getNextReference = async function(type = 'devis') {
  const year = new Date().getFullYear();
  const prefix = type === 'devis' ? 'DEV' : 'PRO';

  const lastDevis = await this.findOne({
    reference: { $regex: `^${prefix}-${year}` }
  }).sort({ reference: -1 });

  let nextNumber = 1;
  if (lastDevis) {
    const lastNumber = parseInt(lastDevis.reference.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${year}-${String(nextNumber).padStart(3, '0')}`;
};

// Middleware pre‑save pour calculer les montants automatiquement
devisSchema.pre('save', function(next) {
  // Calcul du total HT
  this.montantHT = this.lignes.reduce((total, ligne) => total + (ligne.totalHT || 0), 0);

  // Application de la remise globale
  const htApresRemise = this.montantHT * (1 - (this.remiseGlobale || 0) / 100);

  // Calcul de la TVA
  this.montantTVA = htApresRemise * (this.tvaRate || 20) / 100;

  // Calcul du TTC
  this.montantTTC = htApresRemise + this.montantTVA;

  // Mise à jour automatique du statut si expiré et non converti
  if (this.dateValidite && this.status !== 'converted') {
    const [day, month, year] = this.dateValidite.split('/');
    const validiteDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (validiteDate < new Date()) {
      this.status = 'expired';
    }
  }

  next();
});

export default mongoose.model("Devis", devisSchema);

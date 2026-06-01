import VenteConsommable from "../models/VenteConsommable.js";
import Consommable from "../models/Consommable.js";

const POPULATE = [
  { path: "client", select: "prenom nom tel" },
  { path: "consommable", select: "name icon ref prixVente unite" },
];

export const getAllVentes = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const ventes = await VenteConsommable.find(filter).populate(POPULATE).sort({ date: -1 });
    res.json({ success: true, data: ventes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVente = async (req, res) => {
  try {
    const { consommableId, clientId, qte, ...rest } = req.body;
    const conso = await Consommable.findById(consommableId);
    if (!conso) return res.status(404).json({ success: false, message: "Consommable non trouvé" });
    if (conso.stock < qte && !req.body.force) {
      return res.status(400).json({ success: false, message: "Stock insuffisant", stock: conso.stock });
    }
    const vente = new VenteConsommable({
      ...rest,
      client: clientId,
      consommable: consommableId,
      magasin: req.magasinId || null,
      qte,
      prixUnit: rest.prixUnit || conso.prixVente,
      total: (rest.prixUnit || conso.prixVente) * qte,
      date: rest.date || new Date().toLocaleDateString("fr-FR").split("/").reverse().join("/"),
    });
    await vente.save();
    // Mettre à jour le stock de façon atomique pour éviter les conditions de course (Race Conditions)
    await Consommable.findByIdAndUpdate(consommableId, { $inc: { stock: -qte } });
    const populated = await VenteConsommable.findById(vente._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Vente enregistrée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVente = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const vente = await VenteConsommable.findOneAndDelete(filter);
    if (!vente) return res.status(404).json({ success: false, message: "Vente non trouvée" });
    // Restaurer le stock
    await Consommable.findByIdAndUpdate(vente.consommable, { $inc: { stock: vente.qte } });
    res.json({ success: true, message: "Vente supprimée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
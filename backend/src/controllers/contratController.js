import Contrat from "../models/Contrat.js";
import Commande from "../models/Commande.js";
import Client from "../models/Client.js";
import fs from "fs";
import path from "path";

const CLIENT_POP = { path: "client", select: "prenom nom tel email adresse" };
const COMMANDE_POP = { path: "commande", select: "reference dateDebut dateFin montantTTC" };

// ── GET ALL CONTRATS ─────────────────────────────────────
export const getAllContrats = async (req, res) => {
  try {
    const filter = {};
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.client) filter.client = req.query.client;
    if (req.query.commande) filter.commande = req.query.commande;

    const data = await Contrat.find(filter)
      .populate(CLIENT_POP)
      .populate(COMMANDE_POP)
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET ONE CONTRAT ──────────────────────────────────────
export const getContratById = async (req, res) => {
  try {
    const data = await Contrat.findById(req.params.id)
      .populate(CLIENT_POP)
      .populate(COMMANDE_POP);
    
    if (!data) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }
    
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── CREATE CONTRAT FROM COMMANDE ─────────────────────────
export const createContrat = async (req, res) => {
  try {
    const { commandeId, conditionsSpeciales, type } = req.body;
    
    if (!commandeId) {
      return res.status(400).json({ success: false, message: "Commande requise" });
    }

    // Récupérer la commande
    const commande = await Commande.findById(commandeId).populate("client");
    if (!commande) {
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    if (!commande.client) {
      return res.status(400).json({ success: false, message: "Client manquant dans la commande" });
    }

    // Vérifier si un contrat existe déjà pour cette commande
    const existing = await Contrat.findOne({ commande: commandeId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Un contrat existe déjà pour cette commande" });
    }

    // Créer le contrat
    const contrat = await Contrat.create({
      type: type || "location",
      commande: commandeId,
      client: commande.client._id,
      clientNom: `${commande.client.prenom} ${commande.client.nom}`,
      clientEmail: commande.client.email || "",
      clientTel: commande.client.tel || "",
      clientAdresse: commande.client.adresse || "",
      statut: "draft",
      conditionsSpeciales: conditionsSpeciales || "",
      createdBy: req.user?._id || null,
    });

    const populated = await Contrat.findById(contrat._id)
      .populate(CLIENT_POP)
      .populate(COMMANDE_POP);

    res.status(201).json({ success: true, data: populated, message: "Contrat créé ✅" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── GENERATE PDF ─────────────────────────────────────────
export const generatePDF = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id)
      .populate(CLIENT_POP)
      .populate({ 
        path: "commande", 
        populate: [
          { path: "client", select: "prenom nom tel email adresse" },
          { path: "equipement", select: "name categorie" },
          { path: "unite", select: "reference statut" }
        ]
      });

    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    // Pour l'instant, on retourne les données pour générer le PDF côté frontend
    // Dans une implémentation complète, on utiliserait pdfkit ou puppeteer ici
    res.json({ 
      success: true, 
      data: contrat,
      message: "Données récupérées pour génération PDF"
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── SIGN CONTRAT ─────────────────────────────────────────
export const signContrat = async (req, res) => {
  try {
    const { signature } = req.body;
    
    if (!signature) {
      return res.status(400).json({ success: false, message: "Signature requise" });
    }

    const contrat = await Contrat.findById(req.params.id);
    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    if (contrat.statut === "signed") {
      return res.status(400).json({ success: false, message: "Contrat déjà signé" });
    }

    // Capturer l'IP réelle du client
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection?.remoteAddress || req.ip || "N/A";

    contrat.signature = {
      image: signature,
      date: new Date(),
      ip: clientIp,
      userAgent: req.headers["user-agent"] || "",
    };
    contrat.statut = "signed";
    contrat.dateSignature = new Date();

    await contrat.save();

    const populated = await Contrat.findById(contrat._id)
      .populate(CLIENT_POP)
      .populate(COMMANDE_POP);

    res.json({ success: true, data: populated, message: "Contrat signé ✅" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── UPDATE CONTRAT ────────────────────────────────────────
export const updateContrat = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id);
    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    // Empêcher la modification si le contrat est signé
    if (contrat.statut === "signed") {
      return res.status(400).json({ success: false, message: "Impossible de modifier un contrat signé" });
    }

    const { conditionsSpeciales, statut } = req.body;
    
    if (conditionsSpeciales !== undefined) contrat.conditionsSpeciales = conditionsSpeciales;
    if (statut !== undefined) contrat.statut = statut;

    await contrat.save();

    const populated = await Contrat.findById(contrat._id)
      .populate(CLIENT_POP)
      .populate(COMMANDE_POP);

    res.json({ success: true, data: populated, message: "Contrat mis à jour ✅" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── DELETE CONTRAT ────────────────────────────────────────
export const deleteContrat = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id);
    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    // Empêcher la suppression si le contrat est signé
    if (contrat.statut === "signed") {
      return res.status(400).json({ success: false, message: "Impossible de supprimer un contrat signé" });
    }

    // Supprimer le fichier PDF s'il existe
    if (contrat.pdfPath && fs.existsSync(contrat.pdfPath)) {
      fs.unlinkSync(contrat.pdfPath);
    }

    await Contrat.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Contrat supprimé" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ── ARCHIVE CONTRAT ───────────────────────────────────────
export const archiveContrat = async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id);
    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    contrat.archived = !contrat.archived;
    await contrat.save();

    const populated = await Contrat.findById(contrat._id)
      .populate(CLIENT_POP)
      .populate(COMMANDE_POP);

    res.json({ success: true, data: populated, message: contrat.archived ? "Contrat archivé" : "Contrat désarchivé" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

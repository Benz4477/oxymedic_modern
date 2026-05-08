import { Interaction, Tache } from "../models/CRM.js";
import Commande from "../models/Commande.js";
import Client   from "../models/Client.js";

const CLIENT_POP = { path: "client", select: "prenom nom tel adresse quartier" };

// ══════════════════════════════════════════
//  INTERACTIONS
// ══════════════════════════════════════════

export const getAllInteractions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.client) filter.client = req.query.client;
    if (req.query.type)   filter.type   = req.query.type;
    const data = await Interaction.find(filter).populate(CLIENT_POP).sort({ date: -1 });
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const createInteraction = async (req, res) => {
  try {
    const { client, type, titre, note, date } = req.body;
    if (!client) return res.status(400).json({ success: false, message: "Client requis" });
    if (!titre)  return res.status(400).json({ success: false, message: "Titre requis" });
    const doc = await Interaction.create({
      client, type, titre, note,
      date: date ? new Date(date) : new Date(),
      createdBy: req.user?.name || "Admin",
    });
    const populated = await Interaction.findById(doc._id).populate(CLIENT_POP);
    res.status(201).json({ success: true, data: populated, message: "Interaction enregistrée ✅" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const deleteInteraction = async (req, res) => {
  try {
    await Interaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Interaction supprimée" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ══════════════════════════════════════════
//  TÂCHES
// ══════════════════════════════════════════

export const getAllTaches = async (req, res) => {
  try {
    const filter = {};
    if (req.query.done   !== undefined) filter.done   = req.query.done === "true";
    if (req.query.client) filter.client = req.query.client;
    const data = await Tache.find(filter).populate(CLIENT_POP).sort({ echeance: 1, createdAt: -1 });
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const createTache = async (req, res) => {
  try {
    const { titre, client, type, priorite, echeance, assignedTo } = req.body;
    if (!titre) return res.status(400).json({ success: false, message: "Titre requis" });
    const doc = await Tache.create({
      titre, client: client || null, type, priorite,
      echeance: echeance ? new Date(echeance) : null,
      assignedTo: assignedTo || "Admin",
      createdBy: req.user?.name || "Admin",
    });
    const populated = await Tache.findById(doc._id).populate(CLIENT_POP);
    res.status(201).json({ success: true, data: populated, message: "Tâche créée ✅" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const toggleTache = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) return res.status(404).json({ success: false, message: "Tâche non trouvée" });
    tache.done = !tache.done;
    await tache.save();
    const populated = await Tache.findById(tache._id).populate(CLIENT_POP);
    res.json({ success: true, data: populated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const deleteTache = async (req, res) => {
  try {
    await Tache.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Tâche supprimée" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ══════════════════════════════════════════
//  SEGMENTS — score client calculé
// ══════════════════════════════════════════

export const getSegments = async (req, res) => {
  try {
    const clients   = await Client.find();
    const commandes = await Commande.find();

    const scored = clients.map(c => {
      const cmds  = commandes.filter(x => String(x.client) === String(c._id));
      const total = cmds.reduce((s, x) => s + (x.montantTTC || 0), 0);
      const count = cmds.length;

      let grade, label;
      if (total > 5000 || count >= 4) { grade = "A"; label = "VIP"; }
      else if (total > 2000 || count >= 2) { grade = "B"; label = "Fidèle"; }
      else if (total > 500  || count >= 1) { grade = "C"; label = "Actif"; }
      else { grade = "D"; label = "Prospect"; }

      return {
        _id:      c._id,
        prenom:   c.prenom,
        nom:      c.nom,
        tel:      c.tel,
        email:    c.email,
        adresse:  c.adresse,
        grade,
        label,
        totalCA:  total,
        nbCmds:   count,
        dernierCmd: cmds.length ? cmds.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt : null,
      };
    });

    // Grouper par grade
    const segments = {
      A: scored.filter(c => c.grade === "A"),
      B: scored.filter(c => c.grade === "B"),
      C: scored.filter(c => c.grade === "C"),
      D: scored.filter(c => c.grade === "D"),
    };

    res.json({ success: true, data: segments, total: clients.length });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ══════════════════════════════════════════
//  STATS GLOBALES CRM
// ══════════════════════════════════════════

export const getCrmStats = async (req, res) => {
  try {
    const now      = new Date(); now.setHours(0, 0, 0, 0);
    const taches   = await Tache.find();
    const events   = await Interaction.find();
    const clients  = await Client.find();

    const overdue  = taches.filter(t => !t.done && t.echeance && new Date(t.echeance) < now).length;
    const pending  = taches.filter(t => !t.done).length;
    const thisMonth = now.getMonth();
    const eventsMonth = events.filter(e => new Date(e.date).getMonth() === thisMonth).length;

    res.json({
      success: true,
      data: {
        overdue, pending, eventsMonth,
        totalClients: clients.length,
      }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
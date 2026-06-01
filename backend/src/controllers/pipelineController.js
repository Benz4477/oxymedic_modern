import Opportunite from "../models/Opportunite.js";

const POP = [
  { path: "client",     select: "prenom nom tel adresse" },
  { path: "equipement", select: "name icon cat ref photo" },
];

const STAGES = [
  { id: 1, name: "Prospect",      color: "#6B7280", icon: "👤", prob: 20 },
  { id: 2, name: "Contact",       color: "#3B82F6", icon: "📞", prob: 40 },
  { id: 3, name: "Devis envoyé",  color: "#F59E0B", icon: "📝", prob: 60 },
  { id: 4, name: "Négociation",   color: "#8B5CF6", icon: "🤝", prob: 80 },
  { id: 5, name: "Gagné",         color: "#10B981", icon: "🏆", prob: 100 },
  { id: 6, name: "Perdu",         color: "#EF4444", icon: "❌", prob: 0 },
];

// GET /api/pipeline
export const getAllOpportunites = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const data = await Opportunite.find(filter).populate(POP).sort({ createdAt: -1 });
    const active = data.filter(o => o.stageId < 5 && o.stageId !== 6);
    const won    = data.filter(o => o.stageId === 5);
    const closed = data.filter(o => o.stageId === 5 || o.stageId === 6);
    const rate   = closed.length ? Math.round((won.length / closed.length) * 100) : 0;

    res.json({
      success: true,
      data,
      stages: STAGES,
      stats: {
        total:     active.reduce((s, o) => s + o.amount, 0),
        active:    active.length,
        won:       won.length,
        rate,
      },
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /api/pipeline/stages
export const getStages = async (req, res) => {
  res.json({ success: true, data: STAGES });
};

// POST /api/pipeline
export const createOpportunite = async (req, res) => {
  try {
    const { client, equipement, stageId, amount, prob, notes } = req.body;
    if (!client) return res.status(400).json({ success: false, message: "Client requis" });

    const stage = STAGES.find(s => s.id === (stageId || 1));
    const doc = await Opportunite.create({
      client, equipement: equipement || null,
      stageId: stageId || 1,
      amount: amount || 0,
      prob: prob || stage?.prob || 50,
      notes: notes || "",
      magasin: req.magasinId || null,
      createdBy: req.user?.name || "Admin",
    });
    const populated = await Opportunite.findById(doc._id).populate(POP);
    res.status(201).json({ success: true, data: populated, message: "Opportunité créée ✅" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// PUT /api/pipeline/:id
export const updateOpportunite = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const updated = await Opportunite.findOneAndUpdate(filter, req.body, { new: true }).populate(POP);
    if (!updated) return res.status(404).json({ success: false, message: "Opportunité non trouvée" });
    res.json({ success: true, data: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// PUT /api/pipeline/:id/move
export const moveOpportunite = async (req, res) => {
  try {
    const { stageId } = req.body;
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return res.status(400).json({ success: false, message: "Étape invalide" });

    const filterMove = { _id: req.params.id };
    if (req.magasinId) filterMove.magasin = req.magasinId;
    const updated = await Opportunite.findOneAndUpdate(filterMove,
      { stageId, prob: stage.prob },
      { new: true }
    ).populate(POP);
    if (!updated) return res.status(404).json({ success: false, message: "Opportunité non trouvée" });
    res.json({ success: true, data: updated, message: `→ ${stage.name}` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// PUT /api/pipeline/:id/advance
export const advanceOpportunite = async (req, res) => {
  try {
    const filterAdv = { _id: req.params.id };
    if (req.magasinId) filterAdv.magasin = req.magasinId;
    const opp = await Opportunite.findOne(filterAdv);
    if (!opp) return res.status(404).json({ success: false, message: "Opportunité non trouvée" });

    const nextStage = STAGES.find(s => s.id > opp.stageId && s.id < 6);
    if (!nextStage) return res.status(400).json({ success: false, message: "Déjà à l'étape finale" });

    opp.stageId = nextStage.id;
    opp.prob = nextStage.prob;
    await opp.save();

    const populated = await Opportunite.findById(opp._id).populate(POP);
    res.json({ success: true, data: populated, message: `→ ${nextStage.name}` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// DELETE /api/pipeline/:id
export const deleteOpportunite = async (req, res) => {
  try {
    const filterDel = { _id: req.params.id };
    if (req.magasinId) filterDel.magasin = req.magasinId;
    await Opportunite.findOneAndDelete(filterDel);
    res.json({ success: true, message: "Opportunité supprimée" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
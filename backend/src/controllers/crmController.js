import CrmEvent from "../models/CrmEvent.js";
import CrmTask  from "../models/CrmTask.js";
import Client   from "../models/Client.js";
import Commande from "../models/Commande.js";

const POPULATE_CLIENT = { path: "client", select: "prenom nom tel quartier adresse" };

// ── helpers ──────────────────────────────────────────────────────────────────
function clientScore(cmds) {
  const count = cmds.length;
  const total = cmds.reduce((s, c) => s + (c.montantTTC || 0), 0);
  if (total > 5000 || count >= 4) return { grade: "A", label: "VIP" };
  if (total > 2000 || count >= 2) return { grade: "B", label: "Fidèle" };
  if (total > 500  || count >= 1) return { grade: "C", label: "Actif" };
  return { grade: "D", label: "Prospect" };
}

// ── EVENTS ───────────────────────────────────────────────────────────────────

// GET /api/crm/events
export const getEvents = async (req, res) => {
  try {
    const events = await CrmEvent.find()
      .populate(POPULATE_CLIENT)
      .sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/crm/events
export const createEvent = async (req, res) => {
  try {
    const event = await CrmEvent.create(req.body);
    const populated = await event.populate(POPULATE_CLIENT);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/crm/events/:id
export const deleteEvent = async (req, res) => {
  try {
    await CrmEvent.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── TASKS ─────────────────────────────────────────────────────────────────────

// GET /api/crm/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await CrmTask.find()
      .populate(POPULATE_CLIENT)
      .sort({ done: 1, dueDate: 1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/crm/tasks
export const createTask = async (req, res) => {
  try {
    const task = await CrmTask.create(req.body);
    const populated = await task.populate(POPULATE_CLIENT);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/crm/tasks/:id/toggle
export const toggleTask = async (req, res) => {
  try {
    const task = await CrmTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Tâche introuvable" });
    task.done  = !task.done;
    task.doneAt = task.done ? new Date() : null;
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/crm/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    await CrmTask.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── SEGMENTS ──────────────────────────────────────────────────────────────────

// GET /api/crm/segments
export const getSegments = async (req, res) => {
  try {
    const clients  = await Client.find().lean();
    const commandes = await Commande.find().lean();

    const segments = clients.map((c) => {
      const cmds = commandes.filter(
        (cmd) => String(cmd.client) === String(c._id)
      );
      const score = clientScore(cmds);
      const lastCmd = cmds.sort(
        (a, b) => new Date(b.dateFin) - new Date(a.dateFin)
      )[0];
      const totalCA = cmds.reduce((s, cmd) => s + (cmd.montantTTC || 0), 0);
      return {
        _id:       c._id,
        prenom:    c.prenom,
        nom:       c.nom,
        tel:       c.tel,
        score,
        cmdsCount: cmds.length,
        totalCA,
        lastCmd:   lastCmd ? lastCmd.dateFin : null,
        daysSince: lastCmd
          ? Math.floor((Date.now() - new Date(lastCmd.dateFin)) / 86400000)
          : null,
      };
    });

    res.json({ success: true, data: segments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── RENOUVELLEMENTS ───────────────────────────────────────────────────────────

// GET /api/crm/renouvellements?days=30
export const getRenouvellements = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const now  = new Date();
    const limit = new Date(now.getTime() + days * 86400000);

    const commandes = await Commande.find({
      statut:  { $in: ["active", "pending"] },
      dateFin: { $gte: now, $lte: limit },
    })
      .populate({ path: "client", select: "prenom nom tel" })
      .populate({ path: "equipement", select: "name icon ref" })
      .sort({ dateFin: 1 });

    res.json({ success: true, data: commandes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── KPIs ──────────────────────────────────────────────────────────────────────

// GET /api/crm/kpis
export const getKpis = async (req, res) => {
  try {
    const now      = new Date(); now.setHours(0, 0, 0, 0);
    const thisMonth = now.getMonth();
    const thisYear  = now.getFullYear();

    const [tasks, events, clients] = await Promise.all([
      CrmTask.find().lean(),
      CrmEvent.find().lean(),
      Client.find().lean(),
    ]);

    const overdue     = tasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate) < now).length;
    const pending     = tasks.filter(t => !t.done).length;
    const eventsMonth = events.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    res.json({
      success: true,
      data: { overdue, pending, eventsMonth, clients: clients.length },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
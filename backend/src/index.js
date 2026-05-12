import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";

// ── Import des routes ──────────────────────────────────────
import authRoutes        from "./routes/auth.js";
import clientRoutes      from "./routes/clients.js";
import commandeRoutes    from "./routes/commandes.js";
import stockRoutes       from "./routes/stock.js";
import equipementRoutes  from "./routes/equipements.js";   // ✅ nouveau
import unitsRoutes       from "./routes/units.js";
import devisRoutes       from "./routes/devis.js";
import factureRoutes     from "./routes/factures.js";
import serialRoutes      from "./routes/serials.js";
import livraisonRoutes   from "./routes/livraisons.js";
import livreurRoutes     from "./routes/livreurs.js";
import userRoutes        from "./routes/users.js";
import categoryRoutes    from "./routes/categories.js";
import fraisRoutes       from "./routes/frais.js";
import maintenanceRoutes from "./routes/maintenances.js";
import permissionsRoutes from "./routes/permissions.js";
import statsRoutes       from "./routes/stats.js";
import societeRoutes     from "./routes/societe.js";
import paiementRoutes    from "./routes/paiements.js";
import crmRoutes         from "./routes/crmRoutes.js";
import usersRoutes       from "./routes/users.js";
import contratRoutes     from "./routes/contratRoutes.js";
import pipelineRoutes    from "./routes/pipelineRoutes.js";

dotenv.config();
connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ── Fichiers statiques (uploads) ──────────────────────────
app.use("/uploads", express.static(join(__dirname, "../uploads")));

// ── Sécurité ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(mongoSanitize());

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean)
  .concat([
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173", // Vite default
    "http://localhost:5174",
  ]);

app.use(cors({
  origin: (origin, cb) => {
    // Autoriser les requêtes sans origin (ex: Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS bloqué pour : ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Rate limiting ──────────────────────────────────────────
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // augmenté pour le dev
  message: { success: false, message: "Trop de requêtes, réessayez plus tard." },
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // augmenté pour le dev
  skipSuccessfulRequests: true,
  message: { success: false, message: "Trop de tentatives, réessayez dans 15 min." },
});


// ── Body parser ────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth/login", authLimiter);
app.use("/api/auth",         authRoutes);
app.use("/api/clients",      clientRoutes);
app.use("/api/commandes",    commandeRoutes);
app.use("/api/stock",        stockRoutes);
app.use("/api/equipements",  equipementRoutes);  // ✅ nouveau
app.use("/api/units",        unitsRoutes);
app.use("/api/devis",        devisRoutes);
app.use("/api/factures",     factureRoutes);
app.use("/api/serials",      serialRoutes);
app.use("/api/livraisons",   livraisonRoutes);
app.use("/api/livreurs",     livreurRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/categories",   categoryRoutes);
app.use("/api/frais",        fraisRoutes);
app.use("/api/maintenances", maintenanceRoutes);
app.use("/api/permissions",  permissionsRoutes);
app.use("/api/stats",        statsRoutes);
app.use("/api/societe",      societeRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/crm",        crmRoutes);
app.use("/api/contrats",   contratRoutes);
app.use("/api/pipeline",   pipelineRoutes);



// ── Health check ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "OXYMEDIC Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// ── 404 ────────────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route non trouvée : ${req.originalUrl}` });
});

// ── Erreurs globales ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err.message);
  res.status(500).json({
    success: false,
    message: "Erreur serveur interne",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ── Démarrage ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 OXYMEDIC Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
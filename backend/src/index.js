import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { body, param, query, validationResult } from "express-validator";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";

// Import des routes
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import commandeRoutes from "./routes/commandes.js";
import stockRoutes from "./routes/stock.js";
import devisRoutes from "./routes/devis.js";
import factureRoutes from "./routes/factures.js";
import serialRoutes from "./routes/serials.js";
import livraisonRoutes from "./routes/livraisons.js";
import livreurRoutes from "./routes/livreurs.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";
import fraisRoutes from "./routes/frais.js";
import maintenanceRoutes from "./routes/maintenances.js";
import permissionsRoutes from "./routes/permissions.js";
import unitsRoutes from "./routes/units.js";
import statsRoutes from "./routes/stats.js";
import societeRoutes from "./routes/societe.js";

// Configuration
dotenv.config();

// Connexion MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Servir les fichiers uploadés statiquement avec CORS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(
  "/uploads",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
  express.static(join(__dirname, "../uploads")),
);

// Middleware de sécurité
app.use(
  helmet({
    contentSecurityPolicy: false, // Désactivé pour permettre les requêtes cross-origin
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(compression());

// CORS configuration plus sécurisée
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
  }),
);

// Protection contre NoSQL injection
app.use(mongoSanitize());

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Rate limiting plus strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion par 15 minutes
  message: {
    success: false,
    message:
      "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.",
  },
  skipSuccessfulRequests: true,
});

// Body parser avec limites de taille
app.use(express.json({ limit: "1mb" })); // Réduit de 10mb à 1mb pour la sécurité
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Routes
app.use("/api/auth/login", authLimiter); // Rate limiting spécifique pour le login
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/devis", devisRoutes);
app.use("/api/factures", factureRoutes);
app.use("/api/serials", serialRoutes);
app.use("/api/livraisons", livraisonRoutes);
app.use("/api/livreurs", livreurRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/frais", fraisRoutes);
app.use("/api/maintenances", maintenanceRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/units", unitsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/societe", societeRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "OXYMEDIC Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Erreur serveur interne",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 OXYMEDIC Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;

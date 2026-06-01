# CONVENTIONS DU PROJET OXYMEDIC

Ce document décrit toutes les conventions et structures à suivre pour créer de nouveaux modules dans le projet Oxymedic.

---

## 📁 STRUCTURE DU PROJET

### Backend (Node.js + Express + Mongoose)
```
backend/src/
├── models/          # Schémas Mongoose
├── controllers/     # Logique métier
├── routes/          # Définition des routes API
├── middleware/      # Middlewares (auth, validation, upload)
├── config/          # Configuration (base de données)
└── index.js         # Point d'entrée
```

### Frontend (React + Vite + Tailwind)
```
client/src/
├── pages/           # Pages principales (modules)
├── components/      # Composants réutilisables
├── services/        # Services API (appels backend)
├── api/             # Configuration axios
└── config/          # Configuration (menuItems, permissions)
```

---

## 🔧 BACKEND CONVENTIONS

### 1. MODELS (Mongoose Schemas)

#### Structure de base
```javascript
import mongoose from "mongoose";

const modelNameSchema = new mongoose.Schema(
  {
    // Champs du schéma
    fieldName: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

export default mongoose.model("ModelName", modelNameSchema);
```

#### Conventions de nommage
- **Nom du fichier**: `ModelName.js` (PascalCase)
- **Nom du schéma**: `modelNameSchema` (camelCase)
- **Nom du modèle**: `ModelName` (PascalCase)

#### Types de champs courants
```javascript
// String
name: { type: String, required: true, trim: true, default: "" }

// Number
price: { type: Number, required: true, min: 0, default: 0 }

// Boolean
active: { type: Boolean, default: true }

// Date
date: { type: Date, default: Date.now }

// ObjectId (relation)
client: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Client", 
  required: true,
  index: true 
}

// Array
tags: [{ type: String }]

// Enum
status: {
  type: String,
  enum: ["pending", "active", "ended"],
  default: "pending",
  index: true
}
```

#### Relations entre modèles
```javascript
// Relation simple
client: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Client",
  required: true,
  index: true,
}

// Relation optionnelle
commande: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Commande",
  default: null,
}

// Tableau de relations
lignes: [{
  equipement: { type: mongoose.Schema.Types.ObjectId, ref: "Equipement" },
  quantite: { type: Number, default: 1 },
}]
```

#### Auto-génération de référence
```javascript
modelNameSchema.pre("save", async function (next) {
  if (this.isNew && !this.reference) {
    const count = await mongoose.model("ModelName").countDocuments();
    const annee = new Date().getFullYear();
    this.reference = `PREFIX-${annee}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});
```

#### Index pour performance
```javascript
// Index simple
modelNameSchema.index({ client: 1 });

// Index composé
modelNameSchema.index({ client: 1, status: 1 });

// Index unique
modelNameSchema.index({ reference: 1 }, { unique: true });
```

---

### 2. CONTROLLERS

#### Structure de base
```javascript
import ModelName from "../models/ModelName.js";

const POPULATE = [
  { path: "client", select: "prenom nom tel" },
  { path: "otherRelation", select: "field1 field2" },
];

// GET /api/modelnames
const getAllModelNames = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    
    const items = await ModelName.find(filter)
      .populate(POPULATE)
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/modelnames/:id
const getModelNameById = async (req, res) => {
  try {
    const item = await ModelName.findById(req.params.id).populate(POPULATE);
    if (!item) return res.status(404).json({ success: false, message: "Élément non trouvé" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/modelnames
const createModelName = async (req, res) => {
  try {
    const item = await ModelName.create(req.body);
    const populated = await ModelName.findById(item._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Élément créé avec succès" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: Object.values(error.errors).map(e => e.message),
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/modelnames/:id
const updateModelName = async (req, res) => {
  try {
    const item = await ModelName.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate(POPULATE);
    if (!item) return res.status(404).json({ success: false, message: "Élément non trouvé" });
    res.json({ success: true, data: item, message: "Élément mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/modelnames/:id
const deleteModelName = async (req, res) => {
  try {
    const item = await ModelName.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Élément non trouvé" });
    res.json({ success: true, message: "Élément supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { 
  getAllModelNames, 
  getModelNameById, 
  createModelName, 
  updateModelName, 
  deleteModelName 
};
```

#### Conventions de nommage
- **Nom du fichier**: `modelNameController.js` (camelCase)
- **Nom des fonctions**: `getAllModelNames`, `getModelNameById`, `createModelName`, `updateModelName`, `deleteModelName`
- **Constante POPULATE**: Définir les relations à peupler avec les champs à sélectionner

#### Réponse API standard
```javascript
// Succès
res.json({ success: true, data: item, message: "Message de succès" });

// Erreur
res.status(500).json({ success: false, message: error.message });

// Validation error
res.status(400).json({
  success: false,
  message: "Erreur de validation",
  errors: Object.values(error.errors).map(e => e.message),
});

// Not found
res.status(404).json({ success: false, message: "Élément non trouvé" });
```

---

### 3. ROUTES

#### Structure de base
```javascript
import express from "express";
import {
  getAllModelNames,
  getModelNameById,
  createModelName,
  updateModelName,
  deleteModelName,
} from "../controllers/modelNameController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Appliquer le middleware d'authentification
router.use(protect);

// Routes CRUD
router.get("/", getAllModelNames);
router.get("/:id", getModelNameById);
router.post("/", createModelName);
router.put("/:id", updateModelName);
router.delete("/:id", deleteModelName);

// Routes personnalisées
router.put("/:id/custom-action", customAction);

export default router;
```

#### Conventions de nommage
- **Nom du fichier**: `modelnames.js` (pluriel, minuscules)
- **Nom du routeur**: `router`
- **Routes**: Utiliser des noms explicites et RESTful

#### Import dans index.js
```javascript
import modelnamesRoutes from "./routes/modelnames.js";

app.use("/api/modelnames", modelnamesRoutes);
```

---

## 🎨 FRONTEND CONVENTIONS

### 1. SERVICES (API Calls)

#### Structure de base
```javascript
import api from "../api";

const modelNameService = {
  // GET /api/modelnames
  getAll: async (params = {}) => {
    const response = await api.get("/modelnames", { params });
    return response.data.data;
  },

  // GET /api/modelnames/:id
  getById: async (id) => {
    const response = await api.get(`/modelnames/${id}`);
    return response.data.data;
  },

  // POST /api/modelnames
  create: async (data) => {
    const response = await api.post("/modelnames", data);
    return response.data.data;
  },

  // PUT /api/modelnames/:id
  update: async (id, data) => {
    const response = await api.put(`/modelnames/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/modelnames/:id
  delete: async (id) => {
    const response = await api.delete(`/modelnames/${id}`);
    return response.data;
  },
};

export default modelNameService;
```

#### Conventions de nommage
- **Nom du fichier**: `modelNameService.js` (camelCase)
- **Nom du service**: `modelNameService`
- **Nom des fonctions**: `getAll`, `getById`, `create`, `update`, `delete`
- **Alias**: Ajouter des alias si nécessaire (ex: `getAllModelNames`)

---

### 2. PAGES (React Components)

#### Structure de base
```javascript
import React, { useState, useEffect, useCallback } from "react";
import modelNameService from "../../services/modelNameService";
import { toast } from "react-toastify";

const EMPTY_MODEL = {
  field1: "",
  field2: "",
  field3: 0,
};

const ModelNames = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(EMPTY_MODEL);

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await modelNameService.getAll();
      setItems(data);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleCreate = async () => {
    try {
      await modelNameService.create(formData);
      toast.success("Élément créé avec succès");
      setShowModal(false);
      setFormData(EMPTY_MODEL);
      loadItems();
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleUpdate = async () => {
    try {
      await modelNameService.update(selectedItem._id, formData);
      toast.success("Élément mis à jour avec succès");
      setShowModal(false);
      setSelectedItem(null);
      setEditMode(false);
      setFormData(EMPTY_MODEL);
      loadItems();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ?")) return;
    try {
      await modelNameService.delete(id);
      toast.success("Élément supprimé avec succès");
      loadItems();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Gestion des ModelNames
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {items.length} élément{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => { setEditMode(false); setFormData(EMPTY_MODEL); setShowModal(true); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95">
          <Plus size={16} /> Nouvel élément
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Champ 1</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Champ 2</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-900">{item.field1}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{item.field2}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setSelectedItem(item); setFormData(item); setEditMode(true); setShowModal(true); }}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Modifier">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition" title="Supprimer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editMode ? "Modifier" : "Créer"} un élément
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                value={formData.field1}
                onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Champ 1"
              />
              <input
                type="text"
                value={formData.field2}
                onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="Champ 2"
              />
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Annuler
              </button>
              <button onClick={editMode ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                {editMode ? "Modifier" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelNames;
```

#### Conventions de nommage
- **Nom du fichier**: `ModelNames.jsx` (PascalCase, pluriel)
- **Nom du composant**: `ModelNames` (PascalCase, pluriel)
- **Nom du service**: `modelNameService` (camelCase)
- **Constante EMPTY_MODEL**: Définir l'objet vide pour le formulaire

---

### 3. CONFIGURATION (menuItems.js)

#### Structure de base
```javascript
export const menuItems = [
  {
    title: "Catégorie",
    items: [
      { id: "modelnames", label: "ModelNames", icon: IconComponent },
    ],
  },
];
```

#### Conventions de permissions
```javascript
// Dans Utilisateurs.jsx
const EMPTY_FORM = {
  username: "", password: "", name: "", email: "", tel: "",
  role: "employe", status: "active",
  permissions: {
    modelnames: false, // Ajouter la permission pour le nouveau module
  },
};

// Dans menuItems.js
export const getMenuForUser = (user) => {
  if (!user) return [];
  const permissions = user.permissions || {};
  return menuItems
    .map(section => ({
      ...section,
      items: section.items.filter(item => permissions[item.id] === true)
    }))
    .filter(section => section.items.length > 0);
};
```

---

## 🔗 MAPPINGS ENTRE MODULES

### Relations courantes

#### Client ↔ Commande
```javascript
// Dans Commande.js
client: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Client",
  required: true,
  index: true,
}

// Dans commandeController.js
const POPULATE = [
  { path: "client", select: "prenom nom tel quartier adresse" },
];
```

#### Commande ↔ Paiement
```javascript
// Dans Paiement.js
commande: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Commande",
  default: null,
  index: true,
}

// Dans paiementController.js
const POPULATE = [
  { path: "commande", select: "reference montantTTC statut" },
];
```

#### Commande ↔ Facture
```javascript
// Dans Facture.js
commande: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Commande",
  default: null,
}

// Dans factureController.js
const POPULATE = [
  { path: "commande", select: "reference montantTTC dateDebut dateFin statut" },
];
```

---

## 📋 CHECKLIST POUR NOUVEAUX MODULES

### Backend
- [ ] Créer le model dans `backend/src/models/ModelName.js`
- [ ] Créer le controller dans `backend/src/controllers/modelNameController.js`
- [ ] Créer les routes dans `backend/src/routes/modelnames.js`
- [ ] Importer les routes dans `backend/src/index.js`
- [ ] Tester les routes avec Postman ou curl

### Frontend
- [ ] Créer le service dans `client/src/services/modelNameService.js`
- [ ] Créer la page dans `client/src/pages/ModelNames/ModelNames.jsx`
- [ ] Ajouter l'entrée dans `client/src/config/menuItems.js`
- [ ] Ajouter la permission dans `client/src/pages/Utilisateurs/Utilisateurs.jsx`
- [ ] Ajouter la route dans `client/src/App.jsx`
- [ ] Tester la page dans le navigateur

---

## 🎯 CONVENTIONS SPÉCIFIQUES

### Noms de fichiers
- **Backend**: camelCase (`clientController.js`, `clients.js`)
- **Frontend**: PascalCase pour les composants (`Clients.jsx`), camelCase pour les services (`clientService.js`)

### Noms de variables
- **Backend**: camelCase (`getAllClients`, `getClientById`)
- **Frontend**: camelCase (`loadClients`, `handleCreate`)

### Réponses API
- **Succès**: `{ success: true, data: ..., message: "..." }`
- **Erreur**: `{ success: false, message: "..." }`

### Messages
- **Création**: "Élément créé avec succès"
- **Mise à jour**: "Élément mis à jour"
- **Suppression**: "Élément supprimé avec succès"
- **Non trouvé**: "Élément non trouvé"

---

## 📚 EXEMPLES DE MODULES EXISTANTS

### Modules backend existants
- Client (`Client.js`, `clientController.js`, `clients.js`)
- Commande (`Commande.js`, `commandeController.js`, `commandes.js`)
- Paiement (`Paiement.js`, `paiementController.js`, `paiements.js`)
- Facture (`Facture.js`, `factureController.js`, `factures.js`)
- Equipement (`Equipement.js`, `equipementController.js`, `equipements.js`)
- Unit (`Unit.js`, `unitController.js`, `units.js`)

### Modules frontend existants
- Clients (`Clients.jsx`, `clientService.js`)
- Commandes (`Commandes.jsx`, `commandeService.js`)
- Paiements (`Paiements.jsx`, `paiementService.js`)
- Facturation (`Facturation.jsx`, `factureService.js`)

---

## 🔐 SÉCURITÉ

### Middleware d'authentification
```javascript
import { protect } from "../middleware/auth.js";

router.use(protect); // Protéger toutes les routes
```

### Validation des entrées
```javascript
import { validate } from "../middleware/validate.js";
import { body } from "express-validator";

router.post("/", [
  body("field").notEmpty().withMessage("Champ requis"),
  validate,
], createModelName);
```

---

## 🚀 DÉPLOIEMENT

### Variables d'environnement
```env
MONGODB_URI=mongodb://localhost:27017/oxymedic
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

### Commandes
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd client
npm install
npm run dev
```

---

Ce document doit être utilisé comme référence pour créer tous les nouveaux modules du projet Oxymedic.

# 🏗️ Guide d'Implémentation Multi-Magasin - Oxymedic

Ce document explique le fonctionnement du système multi-agences et fournit les règles à suivre pour l'intégration de nouveaux modules.

---

## 1. Concept Global
L'architecture repose sur l'isolation des données par **Magasin (Store)** avec une hiérarchie de gestion à 4 niveaux :
- **Super-Admin** : Contrôle total sur tout le réseau (Royaume).
- **Assistant** : Gère un groupe de magasins qui lui sont affectés par le Super-Admin.
- **Chef de Magasin** : Responsable d'un seul magasin et de son personnel.
- **Employé** (Caissier, Comptable, etc.) : Travaille exclusivement dans son agence de rattachement.

---

## 2. Fonctionnement Technique

### 🔒 Backend (Sécurité & Filtrage)
Le middleware `protect` (dans `auth.js`) définit `req.magasinId` selon le rôle :
1. **Super-Admin** : Accès à tout. `req.magasinId` peut être `null` (vue globale) ou un ID spécifique via `X-Magasin-Id`.
2. **Assistant** : Accès restreint à sa liste `assignedMagasins`. L'en-tête `X-Magasin-Id` doit obligatoirement être dans sa liste d'affectation.
3. **Chef & Employé** : `req.magasinId` est strictement fixé sur leur magasin unique.

### 👥 Hiérarchie des Utilisateurs
- **User.assignedMagasins** : Nouveau champ (Array d'ObjectIds) utilisé spécifiquement pour les Assistants.
- **User.magasin** : Champ unique pour les Chefs et Employés.

### 🌐 Frontend (Contexte & Navigation)
- **Intercepteur API** : Le fichier `src/api/index.js` récupère automatiquement l'`activeMagasinId` depuis la `sessionStorage` et l'injecte dans l'en-tête `X-Magasin-Id` de chaque requête sortante.
- **TopBar** : Gère l'affichage et le changement de contexte pour les administrateurs.

---

## 3. Règles pour les Futurs Modules 🚩

Pour chaque nouveau module que vous créerez, suivez impérativement ces 3 étapes :

### Étape A : Le Modèle (Mongoose)
Ajoutez systématiquement le champ `magasin` dans votre schéma :
```javascript
magasin: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "Magasin", 
  required: true, 
  index: true // Important pour les performances
}
```

### Étape B : Le Contrôleur (Logique)
Utilisez toujours `req.magasinId` pour filtrer et assigner.

#### 1. Lecture (Liste & Unité)
```javascript
// Exemple pour récupérer des données
const filter = {};
if (req.magasinId) filter.magasin = req.magasinId; // Applique le filtre si défini

const items = await MyModel.find(filter);
```

#### 2. Création
```javascript
// Exemple pour créer une donnée
const newItem = new MyModel({
  ...req.body,
  magasin: req.magasinId // Assigne automatiquement au magasin actif
});
await newItem.save();
```

#### 3. Modification / Suppression
```javascript
// Toujours vérifier que l'ID appartient au magasin
const filter = { _id: req.params.id };
if (req.magasinId) filter.magasin = req.magasinId;

const item = await MyModel.findOneAndUpdate(filter, req.body, { new: true });
if (!item) return res.status(404).json({ message: "Non trouvé ou accès refusé" });
```

### Étape C : Le Frontend
Bonne nouvelle : **Vous n'avez presque rien à faire !**
Comme l'intercepteur API gère l'en-tête automatiquement, vos services standards `api.get('/mon-module')` recevront uniquement les données filtrées par le magasin sélectionné.

---

## 4. Points d'Attention Particuliers ⚠️

1. **Données Globales** : Si un module doit être partagé (ex: un catalogue de produits commun), ne filtrez pas par `magasin` dans le contrôleur.
2. **Super-Admin** : N'oubliez pas que pour un Super-Admin sans magasin sélectionné, `req.magasinId` sera `undefined` ou `null`. Votre code doit gérer ce cas (généralement en ne mettant pas le filtre `magasin` dans la requête Mongoose pour tout voir).
3. **Populate** : Si vous faites un `.populate()`, assurez-vous que les documents liés respectent aussi l'isolation si nécessaire.


## 5. Séparation Dépôt et Magasin
La séparation entre le Dépôt Général (Stock) et les Magasins (Vente) est désormais totalement opérationnelle, tant sur le plan visuel que sur le plan de la sécurité.

🏗️ Ce qui a été implémenté :
1. Architecture "Double Entité"
Modèle Unifié mais Distinct : Les sites sont maintenant catégorisés par un type (Magasin ou Dépôt).
Interface Super-Admin : La page "Magasins" est maintenant divisée en deux sections claires : Nos Dépôts Logistiques et Nos Points de Vente.
2. Sécurité Strict "Zéro Vente au Dépôt"
Blocage Backend : Même si quelqu'un essayait de forcer l'API, les contrôleurs (Commandes, Factures, Paiements, Devis) rejettent systématiquement toute création si l'unité active est un Dépôt.
Protection Frontend : Lorsqu'un utilisateur bascule sur un Dépôt :
Un bandeau orange "Mode Logistique Actif" apparaît en haut de l'écran pour prévenir que les ventes sont désactivées.
Les boutons "Nouvelle Commande" et "Nouvelle Facture" sont grisés et un badge "Mode Lecture Seule" s'affiche.
3. Flexibilité Logistique
Vous pouvez désormais créer autant de dépôts que nécessaire (Dépôt Nord, Dépôt Sud, etc.) via l'interface du Super-Admin.
Le Dépôt Général est identifié par une icône d'usine (Factory) et les Magasins par une icône de boutique (Store).
💡 Prochaines étapes suggérées :
Transferts de Stock : Maintenant que nous avons des entités "Dépôt", nous pourrions implémenter un module de "Bon de Transfert" pour déplacer officiellement du matériel d'un Dépôt vers un Magasin.
Inventaire Dépôt : Optimiser la vue stock pour les magasiniers travaillant exclusivement en dépôt.



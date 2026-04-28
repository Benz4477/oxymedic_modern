# OXYMEDIC Gestion Pro - Version Moderne

Application de gestion de location de matériel médical reconstruite avec une stack technologique moderne tout en préservant 100% de l'UI et des fonctionnalités originales.

## 🏗️ Architecture

### Frontend (React + Vite)

- **React 18** avec JSX (pas de TypeScript)
- **Vite** pour le développement rapide
- **React Router Dom** pour la navigation
- **TailwindCSS** pour les styles (UI identique à l'original)
- **Lucide React** pour les icônes (remplacement des emojis)
- **Axios** pour les appels API

### Backend (Node.js + Express)

- **Node.js** avec **Express**
- **MongoDB Atlas** avec **Mongoose**
- **JWT** pour l'authentification
- **Cloudinary** pour le stockage des images
- **Middleware** de sécurité (Helmet, Rate Limiting, CORS)

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- Compte MongoDB Atlas
- Compte Cloudinary

### 1. Installation des dépendances

```bash
# Installer les dépendances frontend et backend
npm run install-all
```

### 2. Configuration Backend

```bash
# Copier et configurer les variables d'environnement
cd backend
cp .env.example .env
# Éditer .env avec vos configurations MongoDB Atlas et Cloudinary
```

### 3. Démarrage

```bash
# Démarrer le backend (port 5000)
npm run backend

# Démarrer le frontend (port 3000) - dans un autre terminal
npm run dev
```

### 4. Accès

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📋 Modules (29 au total)

### Modules Principaux ✅

1. **Dashboard** - Tableau de bord avec KPIs
2. **Clients** - Gestion des clients
3. **Commandes** - Gestion des commandes de location
4. **Stock** - Catalogue et gestion des équipements
5. **Devis** - Création et gestion des devis
6. **Facturation** - Factures et proformas
7. **Paiements** - Suivi des paiements
8. **Cautions** - Gestion des dépôts de garantie
9. **Serials** - Numéros de série et codes-barres
10. **Livraisons** - Livraison GPS avec Waze
11. **Livreurs** - Gestion des livreurs et frais
12. **Utilisateurs** - Administration des comptes

### Modules Secondaires (à implémenter)

13. Analytics & Rapports
14. SAV - Service après-vente
15. Scanner code-barres
16. Liste des produits
17. Pipeline commercial
18. CRM - Relation client
19. Produits consommables
20. Apparence & Personnalisation
21. Cartes de fidélité
22. Droits d'accès par module
23. Maintenance des équipements
24. Catégories & Références
25. Contrats clients
26. Disponibilité des équipements
27. Réservations
28. Notifications
29. Paramètres système

## 🔐 Authentification

### Connexion par défaut

- **Admin**: admin / 1234
- **Employé**: employe / 1234

### Rôles et Permissions

- **Admin**: Accès complet à tous les modules
- **Employé**: Accès limité selon les permissions
- **Livreur**: Gestion des livraisons uniquement
- **Caissier**: Paiements et facturation
- **Comptable**: Rapports et suivi financier
- **Commercial**: Clients et commandes
- **Technicien**: Maintenance et stock

## 🎨 UI/UX - Préservation 100%

### Design Identique

- Mêmes couleurs, polices, espacements
- Mêmes animations et transitions
- Mêmes responsive breakpoints
- Mêmes états hover/focus/active

### Icônes Lucide React

Remplacement de tous les emojis par des icônes Lucide professionnelles:

- 📊 → BarChart3
- 👥 → Users
- 🛒 → ShoppingCart
- 📦 → Package
- 💰 → CreditCard
- 🚚 → Truck
- etc.

## 📊 Base de Données

### Collections MongoDB

- **clients** - Informations clients
- **commandes** - Commandes de location
- **equipements** - Catalogue produits
- **users** - Utilisateurs et permissions
- **paiements** - Historique des paiements
- **cautions** - Dépôts de garantie
- **livraisons** - Suivi des livraisons
- **serials** - Numéros de série

### Indexation Optimale

- Index uniques sur email, téléphone, CIN
- Index composites pour les recherches
- Index géospatiaux pour les livraisons

## ☁️ Cloudinary - Images

### Configuration

1. Créer un compte Cloudinary
2. Configurer les variables d'environnement:
   ```env
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```

### Types d'images

- Photos des équipements
- Avatars clients
- Documents scannés
- Logos et signatures

## 🔧 API Endpoints

### Clients

- `GET /api/clients` - Lister les clients
- `POST /api/clients` - Créer un client
- `GET /api/clients/:id` - Détails client
- `PUT /api/clients/:id` - Modifier client
- `DELETE /api/clients/:id` - Supprimer client

### Commandes

- `GET /api/commandes` - Lister les commandes
- `POST /api/commandes` - Créer commande
- `GET /api/commandes/:id` - Détails commande
- `PUT /api/commandes/:id` - Modifier commande
- `DELETE /api/commandes/:id` - Supprimer commande

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

## 🧪 Tests

### Tests Frontend

```bash
npm run test
```

### Tests Backend

```bash
cd backend
npm run test
```

### Tests E2E

```bash
npm run test:e2e
```

## 📦 Déploiement

### Frontend (Vercel/Netlify)

```bash
npm run build
# Déployer le dossier dist/
```

### Backend (Heroku/Railway)

```bash
cd backend
npm start
```

### Variables d'environnement production

- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas
- `JWT_SECRET` - Secret JWT
- `CLOUDINARY_*` - Config Cloudinary

## 🔄 Migration depuis l'Original

### Étapes de Migration

1. **Export des données** depuis localStorage/IndexedDB
2. **Transformation** au format MongoDB
3. **Import** dans la nouvelle base
4. **Validation** des données migrées
5. **Test** de parité fonctionnelle

### Script de Migration

```bash
npm run migrate:original-to-modern
```

## 🐛 Dépannage

### Problèmes Communs

1. **Connexion MongoDB** - Vérifier l'URI et les permissions IP
2. **Images Cloudinary** - Valider les clés API
3. **CORS** - Configurer les origines autorisées
4. **Build** - Nettoyer node_modules et réinstaller

### Logs

- Frontend: Console navigateur
- Backend: Console serveur + fichier logs
- Database: MongoDB Atlas logs

## 📞 Support

Pour toute question ou problème:

- Documentation technique dans `/docs`
- Issues GitHub pour les bugs
- Contact technique pour le support

---

**OXYMEDIC Gestion Pro v27** - Casablanca, Maroc  
_Reconstruction moderne avec préservation 100% de l'expérience utilisateur_

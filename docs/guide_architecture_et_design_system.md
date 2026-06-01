# Guide d'Architecture & Design System : Du Login Universel au Spatial OS
*Ce document sert de guide technique et graphique pour transposer l'architecture et le design system d'**OXYMEDIC**.*

---

## 📐 Partie 1 : Architecture Technique — Login Universel & Routage Dynamique

### 🔄 Le Workflow Authentification & Rôles

Au lieu de forcer l'utilisateur à choisir son rôle lors de la connexion, le système l'authentifie de manière unique et l'oriente automatiquement en fonction des droits associés à son profil en base de données.

```text
                  +-----------------------------------+
                  |   Page Login : Email + MDP        |
                  +-----------------+-----------------+
                                    |
                                    v Soumission
                  +-----------------+-----------------+
                  |       API POST /login             |
                  +-----------------+-----------------+
                                    |
                                    v Validation Backend
                  +-----------------+-----------------+
                  |   Vérification du Rôle en BDD    |
                  +--------+--------+--------+--------+
                           |        |        |
             +-------------+        |        +-------------+
             | Livreur              | Technicien           | Comptable
             v                      v                      v
  +--------------------+ +--------------------+ +--------------------+
  |  JWT + Rôle        | |  JWT + Rôle        | |  JWT + Rôle        |
  |  LIVREUR           | |  TECHNICIEN        | |  COMPTABLE         |
  +----------+---------+ +----------+---------+ +----------+---------+
             |                      |                      |
             v Redirection React    v Redirection React    v Redirection React
  +----------+---------+ +----------+---------+ +----------+---------+
  |  Interface Mobile  | |  Interface Atelier | |  Interface Bilan   |
  |  Livraisons        | |  & Maintenance     | |  & SYSCOHADA       |
  +--------------------+ +--------------------+ +--------------------+
```

### 1. Structure du Modèle Utilisateur (Exemple BDD)
Dans votre base de données, chaque utilisateur possède un champ `role` unique (ou un tableau de permissions si cumulables) :

```javascript
// Exemple de Schéma Mongoose pour l'utilisateur
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SUPERADMIN', 'EMPLOYE', 'LIVREUR', 'CAISSIER', 'COMPTABLE', 'COMMERCIAL', 'TECHNICIEN'],
    default: 'EMPLOYE'
  },
  isActive: { type: Boolean, default: true }
});
```

---

### 2. Le Store Zustand de gestion d'état (`authStore.js`)
Centralisez l'état d'authentification pour y accéder instantanément depuis n'importe quel composant de l'application :

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({ user: userData, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      // Utile si Ahmed a le droit de basculer de rôle temporairement en interne
      switchTempRole: (newRole) => {
        set((state) => ({
          user: { ...state.user, role: newRole }
        }));
      }
    }),
    {
      name: 'medical-auth-storage' // Persiste la session dans le LocalStorage
    }
  )
);
```

---

### 3. La Garde de Route par Rôle (`RoleGuard.jsx`)
Sécurisez vos pages côté Frontend pour empêcher un `Livreur` d'accéder aux écrans du `Comptable` :

```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirige vers le login si non connecté
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirige vers un écran non autorisé ou le dashboard par défaut si le rôle n'a pas accès
    return <Navigate to="/unauthorized" replace />;
  }

  // Affiche le sous-composant de la route
  return <Outlet />;
};

export default RoleGuard;
```

#### Câblage dans `App.jsx` :
```jsx
<Routes>
  {/* Routes publiques */}
  <Route path="/login" element={<Login />} />

  {/* Espace sécurisé Livreur */}
  <Route element={<RoleGuard allowedRoles={['LIVREUR', 'SUPERADMIN']} />}>
    <Route path="/livraisons" element={<DeliveryDashboard />} />
    <Route path="/livraisons/:id" element={<DeliveryDetail />} />
  </Route>

  {/* Espace sécurisé Technicien */}
  <Route element={<RoleGuard allowedRoles={['TECHNICIEN', 'SUPERADMIN']} />}>
    <Route path="/atelier" element={<TechnicianDashboard />} />
  </Route>
</Routes>
```

---

## 🎨 Partie 2 : Le Design System "Linear.app Light Mode"

Pour obtenir cette interface d'ingénieur ultra-premium, épurée et moderne qui a fait le succès graphique de GESCOLE, voici les spécifications de notre charte graphique :

### 1. Typographie & Hiérarchie
* **Police de Titres (Headings)** : **Outfit** (via Google Fonts). Elle apporte un aspect géométrique, propre et sophistiqué.
* **Police de Contenu (Body)** : **Inter**. C'est la référence absolue des interfaces SaaS pour sa lisibilité extrême en petite taille.
* **Imports Google Fonts** (`index.html` ou `@import` CSS) :
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  ```

---

### 2. Palette de Couleurs (Linear Light Clean)
* **Arrière-plan Global** : `bg-[#f8f9fa]` (Un blanc cassé/gris très clair, doux pour les yeux).
* **Fonds de Cartes (Cards)** : `bg-white` pur. Crée un contraste parfait de relief avec le fond global.
* **Couleur Primaire (Touches d'action)** : **Amber / Gold** (`#f59e0b` à `#d97706`).
* **Bordures Fines** : `border-slate-200/60` ou `border-slate-100` (1px d'épaisseur maximum pour un rendu d'ingénieur de haute précision).
* **Textes** :
  * Titres majeurs : `text-slate-900` ou `text-slate-950`
  * Textes secondaires / puces : `text-slate-500` ou `text-slate-400`
  * Libellés d'en-tête (Labels) : `text-[10px] font-bold uppercase tracking-wider text-slate-400`

---

### 3. Les Cartes Bento Épurées (Bento Grid Cards)
Le secret des cartes haut de gamme réside dans la **suppression des grosses ombres portées noires** au profit de bordures fines et d'un micro-ombrage presque invisible.

```css
/* Style de carte Linear Light */
.card-linear {
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.6); /* border-slate-200/60 */
  border-radius: 1rem; /* rounded-2xl (16px) */
  padding: 1.5rem; /* p-6 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.02); /* micro-ombre fine */
  transition: all 0.2s ease-in-out;
}

.card-linear:hover {
  border-color: rgba(203, 213, 225, 1); /* border-slate-350 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
}
```

---

### 4. Le Command Dock Flottant (Navigation Immersive)
Pour libérer 100% de la largeur d'écran (Canvas Immersif) au lieu d'utiliser une barre latérale (Sidebar) encombrante :

```jsx
// Exemple de Dock Horizontal Flottant placé en bas de page
const CommandDock = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full shadow-2xl transition-all duration-300">
      {/* Boutons d'icônes avec Tooltips animés */}
      <button className="p-2 text-slate-400 hover:text-white hover:-translate-y-0.5 transition-all">
        <Home size={18} />
      </button>
      <button className="p-2 text-slate-400 hover:text-white hover:-translate-y-0.5 transition-all">
        <Truck size={18} />
      </button>
      
      <span className="w-px h-5 bg-slate-800 mx-1"></span>
      
      {/* Bouton de profil avec badge rôle discret */}
      <div className="flex items-center gap-2 pl-1.5 pr-2 py-1 bg-slate-800/50 rounded-full">
        <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[9px]">
          L
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Livreur</span>
      </div>
    </div>
  );
};
```

---

## 🛠️ Partie 3 : Application Métier Concrète pour le Médical

Voici comment découper vos interfaces pour valoriser chaque métier sur le terrain :

### 1. L'Interface Livreur (Mobile-First)
* **Contrainte** : Le livreur est sur la route, il conduit, il a les mains encombrées de matériel lourd (lit médicalisé, bouteille d'oxygène).
* **Design** : Grosses cartes tactiles, bouton unique pour ouvrir le GPS (Google Maps/Waze), module de signature client directement sur l'écran tactile, et possibilité de prendre une photo du matériel installé pour archivage (preuve de conformité de livraison).

### 2. L'Interface Technicien (Atelier & Rigueur)
* **Contrainte** : Le technicien gère la désinfection stricte et le contrôle technique du matériel retourné.
* **Design** : Liste de contrôle (Checklist) étape par étape pour valider le protocole d'hygiène obligatoire, et scan du code-barres du matériel pour mettre à jour son statut ("Disponible", "En Maintenance", "Désinfecté").

### 3. L'Interface Commercial (Efficacité & Rapidité)
* **Contrainte** : Le commercial est au téléphone, il doit aller très vite pour louer un lit à un patient en sortie d'hôpital.
* **Design** : Masque de saisie ultra-rapide (Boutons raccourcis pour les durées : 1 semaine, 1 mois, 3 mois), calcul automatique du dépôt de garantie (caution) et génération instantanée du contrat de location en PDF.

---

> [!TIP]
> **Recommandation d'Ingénieur** :
> En adoptant ce **Design System épuré Linear Light** et cette **Architecture Découplée**, votre application de location médicale passera instantanément d'un outil générique à une plateforme logicielle à très haute valeur ajoutée, prête à séduire des cliniques, pharmacies et réseaux de soins d'excellence !

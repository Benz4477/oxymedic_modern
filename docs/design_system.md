# Oxymedic - Guide de Style (Design System "Flat Premium")

Ce document regroupe les standards de design (classes TailwindCSS) utilisés dans l'application Oxymedic. Suivez ces règles pour garantir une cohérence visuelle "Premium", moderne et épurée lors de la création de nouveaux modules.

---

## 1. Couleurs et Fonds (Palette)

L'application utilise une palette basée sur **Slate** (gris bleuté professionnel) et **Emerald** (vert santé/succès).

*   **Fond principal de l'application (Page)** : `bg-[#F8FAFC]` (Slate 50 ultra clair)
*   **Fond des conteneurs (Cartes, Modales, Tableaux)** : `bg-white`
*   **Fonds secondaires (Inputs, Zones neutres, Hover de tableau)** : `bg-slate-50`
*   **Couleur Primaire (Action principale, Boutons)** : `bg-emerald-600 hover:bg-emerald-700`
*   **Bordures subtiles** : `border-slate-50` ou `border-slate-100`

---

## 2. Formes et Ombres (Bordures & Arrondis)

Pour un look moderne "Soft", on utilise des arrondis généreux et des ombres diffuses.

*   **Grandes Cartes / Modales / Tableaux** : `rounded-[2rem]` (ou `rounded-3xl`)
*   **Boutons / Inputs / Petites Cartes** : `rounded-2xl` ou `rounded-xl`
*   **Badges / Tags** : `rounded-lg`
*   **Ombre par défaut des conteneurs** : `shadow-sm`
*   **Ombre au survol (Cartes interactives)** : `hover:shadow-2xl hover:shadow-emerald-500/10` (Crée un effet de halo vert très subtil).

---

## 3. Typographie (Hiérarchie des textes)

La typographie joue sur des contrastes forts entre des titres très gras et des sous-titres minuscules très espacés.

*   **Titre Principal de Page (H1)** : `text-2xl font-extrabold text-slate-900 tracking-tight`
*   **Titre de Carte / Modale (H3)** : `text-xl font-black text-slate-900`
*   **Texte standard** : `text-sm font-semibold text-slate-600`
*   **Sous-titres / Labels de formulaire / En-têtes de tableau (TRES IMPORTANT)** : 
    `text-[10px] font-black uppercase tracking-widest text-slate-400`
    *(C'est ce qui donne le côté très technique et premium à l'interface)*
*   **Données importantes (Noms, Références)** : `text-[13px] font-black text-slate-800`

---

## 4. Composants Réutilisables

### 4.1. Les Formulaires (Inputs & Selects)

Fini les bordures grises classiques. Les inputs utilisent un fond gris clair et un contour dynamique au focus.

```html
<!-- Input Standard -->
<div className="space-y-1.5">
  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
    Nom du champ
  </label>
  <input 
    type="text" 
    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
    placeholder="Saisir une valeur..."
  />
</div>
```

### 4.2. Les Tableaux (Listes de données)

Les tableaux doivent être aérés, avec des séparateurs presque invisibles.

```html
<div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
  <table className="w-full">
    <thead className="bg-slate-50/50">
      <tr>
        <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
          Colonne 1
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-50">
      <tr className="group hover:bg-slate-50/80 transition-colors">
        <td className="px-6 py-4">
          <!-- Contenu -->
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 4.3. Les Modales (Fenêtres pop-up)

Les modales utilisent un arrière-plan flouté (glassmorphism) et sont fortement arrondies.

```html
<!-- Backdrop -->
<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
  <!-- Conteneur Modale -->
  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
    
    <!-- Header Modale -->
    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-xl font-black text-slate-900">Titre Modale</h3>
      <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
        <X size={20} />
      </button>
    </div>

    <!-- Corps (Scrollable) -->
    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
      <!-- Formulaire ici -->
    </div>

    <!-- Footer Modale -->
    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
      <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Annuler</button>
      <button className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20">Enregistrer</button>
    </div>
  </div>
</div>
```

### 4.4. Badges et Statuts

Utiliser des couleurs douces de fond avec un texte coloré et une petite bordure.

*   **Succès / Actif** : `bg-emerald-50 text-emerald-600 border border-emerald-100`
*   **Avertissement / En attente** : `bg-amber-50 text-amber-600 border border-amber-100`
*   **Erreur / Suspendu / Inactif** : `bg-rose-50 text-rose-600 border border-rose-100`
*   **Neutre / Info** : `bg-slate-50 text-slate-500 border border-slate-100` ou `bg-blue-50 text-blue-600`

**Classe de base pour un badge :**
`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider`

---

## 5. Micro-interactions & Animations

Rendez l'interface vivante avec de petites transitions TailwindCSS sur tous les éléments interactifs.

*   **Sur tout élément cliquable / survolable** : Ajoutez `transition-all duration-300` (ou `duration-500` pour les gros blocs).
*   **Boutons principaux** : Ajoutez une ombre colorée au repos ou au survol `shadow-lg shadow-emerald-500/20`.
*   **Cartes cliquables** : Ajoutez un léger soulèvement au survol `hover:-translate-y-1` ou `hover:-translate-y-2`.
*   **Animation d'entrée de page** : Enveloppez la page principale de `animate-in fade-in duration-500` pour une apparition en douceur au chargement.

---

## 📝 Check-list de vérification "Flat Premium"

Avant de valider un nouveau module, vérifiez :
- [ ] Le fond de la page est bien `#F8FAFC`.
- [ ] Les bordures sont discrètes (`border-slate-50` ou `100`), **pas de bordures grises foncées**.
- [ ] Les inputs n'ont pas de bordure (`border-none`) mais un fond `bg-slate-50`.
- [ ] Les labels et en-têtes de tableaux sont en majuscules, très petits (`text-[10px]`) et espacés (`tracking-widest`).
- [ ] Les coins sont très arrondis (`rounded-2xl` à `rounded-[2rem]`).
- [ ] Les ombres sont légères et/ou colorées au survol.

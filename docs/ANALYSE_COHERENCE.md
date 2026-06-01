# Analyse de Cohérence Schéma vs Implémentation

## 🔍 Problème Principal : Mix ObjectId vs Number

Le schéma ERD définit tous les IDs comme des `number`, mais l'implémentation MongoDB utilise un mix de `ObjectId` et `number`.

## 📋 Tableau Comparatif

| Entité | Champ ID (Schéma) | Type (Schéma) | Type (Implémentation) | Statut |
|--------|------------------|---------------|----------------------|--------|
| **Client** | id | number | _id (ObjectId) | ❌ INCOHÉRENT |
| **Commande** | clientId | number | number | ✅ COHÉRENT |
| **Commande** | equipId | number | number | ✅ COHÉRENT |
| **Commande** | unitId | number | number | ✅ COHÉRENT |
| **Equipement** | id | number | _id (ObjectId) | ❌ INCOHÉRENT |
| **Unit** | id | number | number | ✅ COHÉRENT |
| **Unit** | equipId | number | ObjectId | ❌ INCOHÉRENT |
| **Unit** | clientId | number | number | ✅ COHÉRENT |
| **Facture** | clientId | number | number | ✅ COHÉRENT |
| **Devis** | clientId | number | number | ✅ COHÉRENT |

## 🚨 Problèmes Identifiés

### 1. **Client.js**
- ❌ Manque le champ `id` numérique
- ❌ Utilise `_id` ObjectId au lieu de `id` number

### 2. **Equipement.js**
- ❌ Manque le champ `id` numérique
- ❌ Manque le champ `icon` (présent dans schéma)
- ❌ Utilise `_id` ObjectId au lieu de `id` number

### 3. **Unit.js**
- ❌ `equipId` est ObjectId mais devrait être number
- ✅ `clientId` est number (cohérent)

### 4. **Commande.js**
- ✅ Tous les IDs foreign key sont number (cohérent)
- ✅ `id` numérique auto-généré

### 5. **Facture.js & Devis.js**
- ✅ `clientId` est number (cohérent)
- ✅ Utilisent des IDs numériques pour les foreign keys

## 🎯 Solutions Proposées

### Option 1 : Standardiser sur ObjectId (Recommandé)
**Avantages**:
- ✅ Natif MongoDB
- ✅ Pas besoin de conversion
- ✅ Plus robuste

**Inconvénients**:
- ❌ Modification majeure du code existant
- ❌ Mise à jour des contrôleurs

### Option 2 : Standardiser sur Number IDs
**Avantages**:
- ✅ Cohérent avec schéma ERD
- ✅ Plus simple pour l'API REST

**Inconvénients**:
- ❌ Conversion manuelle requise
- ❌ Moins performant que ObjectId

## 📝 Plan d'Action

### Phase 1 : Correction Immédiate
1. **Ajouter champ `id` numérique** dans Client.js et Equipement.js
2. **Corriger `equipId` dans Unit.js** (ObjectId → number)
3. **Ajouter champ `icon` dans Equipement.js**

### Phase 2 : Migration Données
1. **Script de migration** pour peupler les nouveaux `id` numériques
2. **Mise à jour des références** existantes

### Phase 3 : Nettoyage Code
1. **Supprimer les conversions** parseInt() inutiles
2. **Uniformiser les mapping** dans le frontend
3. **Nettoyer les logs de debug**

## 🔧 Implémentation Recommandée

Choisir **Option 2 (Number IDs)** car:
- ✅ Le schéma ERD est bien conçu
- ✅ Les commandes fonctionnent déjà avec des nombres
- ✅ Moins de modifications requises
- ✅ Plus simple pour l'intégration frontend

## 📊 Impact Estimé

**Fichiers à modifier**:
- ✅ Client.js (ajouter id numérique)
- ✅ Equipement.js (ajouter id et icon)
- ✅ Unit.js (corriger equipId)
- ✅ Contrôleurs (adapter les requêtes)
- ✅ Frontend (simplifier les mappings)

**Risque** : 🟡 Moyen (nécessite migration de données)
**Bénéfice** : 🟢 Élevé (cohérence totale)
---

## 🛡️ Logique de Gestion des Stocks & Transferts Inter-Sites (Optimisation Mai 2026)

Pour garantir une traçabilité totale et éviter toute erreur humaine, le système implémente désormais une logique de flux "Air-Gap" (sécurisée par étape).

### 1. Le Cycle de Vie du Matériel en Mouvement
Afin d'éviter qu'une machine ne soit réservée alors qu'elle est physiquement dans un camion, nous avons introduit un verrouillage automatique :

*   **ÉTAT : PENDING (En attente)**
    *   *Action* : Création du bon par l'Entrepôt.
    *   *Impact Stock* : Aucun changement, la machine reste `disponible` à l'entrepôt.
*   **ÉTAT : IN_TRANSIT (En cours de transport)**
    *   *Action* : Le chauffeur part. L'entrepôt clique sur "Expédier".
    *   *Impact Stock* : Le statut de l'unité devient **`en_transfert`**. Elle est instantanément masquée des listes de réservation de TOUS les magasins.
*   **ÉTAT : COMPLETED (Réceptionné)**
    *   *Action* : Le magasin de destination clique sur "Réceptionner" après vérification.
    *   *Impact Stock* : 
        *   L'unité change de propriétaire (`magasinId` mis à jour).
        *   Le statut repasse en **`disponible`**.
        *   Une ligne d'historique est ajoutée à la machine (Traçabilité).

### 2. Gestion Mixte : Machines vs Consommables
Le système gère intelligemment la différence entre le matériel lourd (S/N) et le consommable (Quantité) :

*   **Unités (Machines)** : Suivies par leur identifiant unique (Serial Number). Déplacement atomique d'un magasin à l'autre.
*   **Consommables** : Gestion par calcul de stock (`$inc`). 
    *   *Débit* : -X à la source.
    *   *Crédit* : +X à la destination.
    *   *Auto-Création* : Si le magasin de destination n'a jamais eu ce consommable, le système crée automatiquement sa fiche produit (copie conforme du catalogue maître).

### 3. Matrice de Sécurité Logistique
Pour éviter qu'un magasin ne manipule les stocks d'un autre, des verrous logiciels ont été posés :

| Action | Autorisé pour | Règle de Sécurité |
| :--- | :--- | :--- |
| **Initier un transfert** | Dépôts / Admin | Le bouton "Nouveau" est masqué dans les boutiques simples. |
| **Expédier (In Transit)** | Magasin Source | Empêche une boutique de valider le départ d'un camion qu'elle n'a pas chargé. |
| **Réceptionner (Completed)** | Magasin Cible | Seul le destinataire peut confirmer qu'il a bien reçu le matériel. |
| **Modification / Annulation** | Admin uniquement | Une fois expédié, seul un administrateur peut intervenir pour corriger une erreur. |

---

> [!TIP]
> **Maintenance Future** : La structure des données utilise des transactions `mongoose.startSession()`. Cela garantit qu'en cas de panne réseau durant un transfert, le stock n'est jamais "perdu" ou "doublé" (principe d'atomicité).

import mongoose from "mongoose";

const societeSchema = new mongoose.Schema(
  {
    // ── Identité ─────────────────────────────────────────
    nom:    { type: String, default: "OXYMEDIC" },
    slogan: { type: String, default: "Le confort médical à domicile" },
    logo:   { type: String, default: "" },

    // ── Adresse principale (SAV / Casablanca) ────────────
    adresse: { type: String, default: "7 Rue Al Kassar Maarif" },
    ville:   { type: String, default: "Casablanca" },
    tel:     { type: String, default: "0520-882-443" },
    tel2:    { type: String, default: "" },
    email:   { type: String, default: "info@oxymedic.ma" },
    website: { type: String, default: "www.oxymedic.ma" },

    // ── 2ème adresse (Magasin / Kénitra) ─────────────────
    adresse2:  { type: String, default: "2083 Résidence Hafsa, Magasin 2, Haddada" },
    ville2:    { type: String, default: "Kénitra" },
    tel_mag:   { type: String, default: "0530-537-797" },
    siege:     { type: String, default: "2083 Résidence Hafsa, Magasin 2, Haddada - Kénitra 14012" },

    // ── Identifiants légaux ──────────────────────────────
    ice:     { type: String, default: "001582339000012" },
    rc:      { type: String, default: "350225" },
    if_fisc: { type: String, default: "18779961" },
    patente: { type: String, default: "23002952" },
    cnss:    { type: String, default: "" },

    // ── Banque ───────────────────────────────────────────
    banque: { type: String, default: "Banque Populaire" },
    agence: { type: String, default: "Agence CITE PLATEAU" },
    rib:    { type: String, default: "190 780 2121145906690006 11" },
    iban:   { type: String, default: "" },
    swift:  { type: String, default: "" },

    // ── Paramètres financiers ────────────────────────────
    tva_rate:          { type: Number, default: 20 },
    validite_devis:    { type: Number, default: 30 },
    validite_proforma: { type: Number, default: 15 },

    // ── Vendeur par défaut ───────────────────────────────
    vendeur_defaut: { type: String, default: "" },

    // ── Conditions générales de location ─────────────────
    conditions_location: {
      type: String,
      default: `CONDITIONS GÉNÉRALES DE LOCATION - OXYMEDIC

Les présentes conditions générales de location précisent les droits et obligations applicables à la location, à la livraison, à l'installation, à l'utilisation, à la récupération et à la restitution du matériel médical mis à disposition par OXYMEDIC, sauf conditions particulières contraires mentionnées expressément sur le devis.

CLAUSES GÉNÉRALES

1 - Règlement
La location est payable d'avance. Le règlement s'effectue par virement bancaire. En cas de retour anticipé, aucun remboursement ne sera effectué.

2 - Conditions de paiement
Le paiement intégral du montant total TTC est obligatoire pour confirmer la commande. Aucune livraison ne sera effectuée sans réception du règlement complet.

3 - Coordonnées de paiement
Virement instantané au profit de la Société OXYMEDIC.

4 - Garantie
La caution sera versée à la société OXYMEDIC par chèque bancaire ou espèces et sera rendue au locataire lors de la restitution du bien, déduction faite des éventuels dommages relatifs à sa responsabilité.

5 - Encaissement de la caution
Le propriétaire pourra encaisser la caution dans le cas où le locataire refuse de payer le loyer ou ne restitue pas le matériel dans un délai de 40 jours.

6 - Livraison et installation
La livraison, l'installation, la mise en service et la récupération sont assurées par OXYMEDIC. Les délais sont indicatifs selon disponibilité logistique. Les frais sont précisés dans le devis.

7 - Utilisation du matériel
Le matériel doit être utilisé conformément à sa destination médicale, aux consignes d'utilisation remises au client ainsi qu'aux règles élémentaires de sécurité.

RESPONSABILITÉ ET ATTRIBUTION

8 - Responsabilité du locataire
Dommages (dégâts, perte et vol) : le locataire est responsable jusqu'à la restitution du bien.

9 - Obligations du locataire
- Respecter les règles d'utilisation et préserver l'intégrité du matériel.
- Ne pas céder, sous-louer ou modifier le matériel.
- Être le seul responsable du matériel loué.
- Assumer tout dommage corporel ou matériel causé.

10 - Décharge de responsabilité
Pendant la durée de location, le propriétaire est dégagé de toute responsabilité liée à l'utilisation du matériel.

11 - Réparations et dommages
Les dommages seront à la charge du locataire, le matériel restant propriété du propriétaire.

12 - Attribution de compétence
Tout différend sera soumis au tribunal de commerce de Casablanca, même en cas de pluralité de défendeurs.

13 - Contact d'urgence
Tél : 0631-801-801
E-mail : info@oxymedic.ma`,
    },

    // ── Notes documents ──────────────────────────────────
    note_facture:  { type: String, default: "Paiement sous 30 jours." },
    note_proforma: { type: String, default: "Cette proforma est valable 15 jours." },
    pied_page:     { type: String, default: "Merci de votre confiance — OXYMEDIC" },

    // ── Apparence ────────────────────────────────────────
    couleur_principale: { type: String, default: "#16A34A" },
  },
  { timestamps: true }
);

export default mongoose.model("Societe", societeSchema);
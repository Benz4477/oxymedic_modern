import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    name:     { type: String, required: true, trim: true },
    email:    { type: String, default: "", trim: true },
    tel:      { type: String, default: "" },
    avatar:   { type: String, default: "" },

    role: {
      type: String,
      enum: ["superadmin", "admin", "commercial", "livreur", "caissier", "comptable", "technicien", "employe"],
      default: "employe",
    },

    permissions: {
      dashboard:    { type: Boolean, default: true  },
      clients:      { type: Boolean, default: false },
      commandes:    { type: Boolean, default: false },
      stock:        { type: Boolean, default: false },
      serials:      { type: Boolean, default: false },
      paiements:    { type: Boolean, default: false },
      facturation:  { type: Boolean, default: false },
      devis:        { type: Boolean, default: false },
      contrats:     { type: Boolean, default: false },
      crm:          { type: Boolean, default: false },
      pipeline:     { type: Boolean, default: false },
      fidelite:     { type: Boolean, default: false },
      agenda:        { type: Boolean, default: false },
      disponibilite: { type: Boolean, default: false },
      reservations:  { type: Boolean, default: false },
      livreurs:      { type: Boolean, default: false },
      categories:    { type: Boolean, default: false },
      maintenance:   { type: Boolean, default: false },
      apparence:     { type: Boolean, default: false },
      access:        { type: Boolean, default: false },
      cautions:      { type: Boolean, default: false },
      livraisons:   { type: Boolean, default: false },
      societe:      { type: Boolean, default: false },
      utilisateurs: { type: Boolean, default: false },
    },

    status:    { type: String, enum: ["active", "inactive"], default: "active" },
    system:    { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export const DEFAULT_PERMISSIONS = {
  superadmin:  { dashboard:true, clients:true, commandes:true, stock:true, serials:true, paiements:true, facturation:true, devis:true, contrats:true, crm:true, pipeline:true, fidelite:true, agenda:true, disponibilite:true, reservations:true, livreurs:true, categories:true, maintenance:true, apparence:true, access:true, cautions:true, livraisons:true, societe:true, utilisateurs:true },
  admin:       { dashboard:true, clients:true, commandes:true, stock:true, serials:true, paiements:true, facturation:true, devis:true, contrats:true, crm:true, pipeline:true, fidelite:true, agenda:true, disponibilite:true, reservations:true, livreurs:true, categories:true, maintenance:true, apparence:true, access:true, cautions:true, livraisons:true, societe:true, utilisateurs:false },
  commercial:  { dashboard:true, clients:true, commandes:true, stock:false, serials:false, paiements:false, facturation:false, devis:true, contrats:true, crm:true, pipeline:true, fidelite:true, agenda:true, disponibilite:true, reservations:true, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:false, livraisons:false, societe:false, utilisateurs:false },
  livreur:     { dashboard:true, clients:false, commandes:true, stock:false, serials:false, paiements:false, facturation:false, devis:false, contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:true, categories:false, maintenance:false, apparence:false, access:false, cautions:false, livraisons:true, societe:false, utilisateurs:false },
  caissier:    { dashboard:true, clients:true, commandes:true, stock:false, serials:false, paiements:true, facturation:true, devis:false, contrats:true, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:true, livraisons:false, societe:false, utilisateurs:false },
  comptable:   { dashboard:true, clients:false, commandes:false, stock:false, serials:false, paiements:true, facturation:true, devis:false, contrats:true, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:true, livraisons:false, societe:false, utilisateurs:false },
  technicien:  { dashboard:true, clients:false, commandes:false, stock:true, serials:true, paiements:false, facturation:false, devis:false, contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:true, apparence:false, access:false, cautions:false, livraisons:false, societe:false, utilisateurs:false },
  employe:     { dashboard:true, clients:true, commandes:true, stock:false, serials:false, paiements:false, facturation:false, devis:false, contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:false, livraisons:false, societe:false, utilisateurs:false },
};

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const defaults = DEFAULT_PERMISSIONS[this.role] || DEFAULT_PERMISSIONS.employe;
    Object.keys(defaults).forEach(mod => {
      if (!this.permissions[mod]) this.permissions[mod] = defaults[mod];
    });
  }
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) { next(error); }
});

userSchema.methods.comparePassword = async function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.model("User", userSchema);
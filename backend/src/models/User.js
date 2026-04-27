import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "employe",
        "livreur",
        "caissier",
        "comptable",
        "commercial",
        "technicien",
      ],
      default: "employe",
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    system: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Middleware pour hasher le mot de passe avec bcrypt avant sauvegarde
userSchema.pre("save", async function (next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);

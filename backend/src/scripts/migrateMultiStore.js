import mongoose from "mongoose";
import dotenv from "dotenv";
import Magasin from "../models/Magasin.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Commande from "../models/Commande.js";
import Facture from "../models/Facture.js";
import Paiement from "../models/Paiement.js";
import Equipement from "../models/Equipement.js";
import Unit from "../models/Unit.js";
import Devis from "../models/Devis.js";
import Caution from "../models/Caution.js";
import Frais from "../models/Frais.js";
import Sav from "../models/Sav.js";
import Maintenance from "../models/Maintenance.js";
import Livraison from "../models/Livraison.js";
import Livreur from "../models/Livreur.js";
import Consommable from "../models/Consommable.js";
import VenteConsommable from "../models/VenteConsommable.js";
import Contrat from "../models/Contrat.js";
import Loyalty from "../models/Loyalty.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // 1. Créer le magasin par défaut si inexistant
    let casa = await Magasin.findOne({ nom: "Casablanca" });
    if (!casa) {
      casa = await Magasin.create({
        nom: "Casablanca",
        ville: "Casablanca",
        adresse: "Siège Social, Casablanca",
        isDefault: true,
        status: "active"
      });
      console.log("Magasin 'Casablanca' créé !");
    } else {
      console.log("Magasin 'Casablanca' déjà existant.");
    }

    const casaId = casa._id;

    // 2. Liste des modèles à migrer
    const models = [
      { name: "User", model: User },
      { name: "Client", model: Client },
      { name: "Commande", model: Commande },
      { name: "Facture", model: Facture },
      { name: "Paiement", model: Paiement },
      { name: "Equipement", model: Equipement },
      { name: "Unit", model: Unit },
      { name: "Devis", model: Devis },
      { name: "Caution", model: Caution },
      { name: "Frais", model: Frais },
      { name: "Sav", model: Sav },
      { name: "Maintenance", model: Maintenance },
      { name: "Livraison", model: Livraison },
      { name: "Livreur", model: Livreur },
      { name: "Consommable", model: Consommable },
      { name: "VenteConsommable", model: VenteConsommable },
      { name: "Contrat", model: Contrat },
      { name: "Loyalty", model: Loyalty }
    ];

    for (const item of models) {
      console.log(`Migration de ${item.name}...`);
      // On n'écrase pas si un magasin est déjà défini
      const result = await item.model.updateMany(
        { magasin: { $exists: false } },
        { $set: { magasin: casaId } }
      );
      console.log(`${item.name}: ${result.modifiedCount} documents mis à jour.`);
    }

    console.log("Migration terminée avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("Erreur de migration:", error);
    process.exit(1);
  }
};

migrate();

// utils/enrichCommandes.js
import Client from "../models/Client.js";
import Equipement from "../models/Equipement.js";
import Unit from "../models/Unit.js";

export const enrichirCommande = async (commande) => {
  const client = await Client.findOne({ id: commande.clientId });
  const equipement = await Equipement.findOne({ id: commande.equipId });
  const unit = commande.unitId ? await Unit.findOne({ id: commande.unitId }) : null;

  return {
    ...commande.toObject(),
    clientNom: client ? `${client.prenom} ${client.nom}` : "Client inconnu",
    clientTel: client?.tel,
    equipementNom: equipement?.name,
    equipementIcon: equipement?.icon,
    unitSerial: unit?.serial,
  };
};
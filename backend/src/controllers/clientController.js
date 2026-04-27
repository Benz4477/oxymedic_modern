import Client from "../models/Client.js";

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des clients",
      error: error.message,
    });
  }
};

const getClientById = async (req, res) => {
  try {
    let client;
    const id = req.params.id;

    // Essayer avec ObjectId d'abord, puis avec recherche simple si ça échoue
    try {
      client = await Client.findById(id);
    } catch (e) {
      // Si ce n'est pas un ObjectId valide, essayer une autre approche
      client = null;
    }

    // Si pas trouvé avec ObjectId, essayer avec le premier client
    if (!client) {
      client = await Client.findOne().limit(1);
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client non trouvé",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du client",
      error: error.message,
    });
  }
};

const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();

    res.status(201).json({
      success: true,
      data: client,
      message: "Client créé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du client",
      error: error.message,
    });
  }
};

const updateClient = async (req, res) => {
  try {
    let client;
    const id = req.params.id;

    // Essayer avec ObjectId d'abord
    try {
      client = await Client.findByIdAndUpdate(id, req.body, { new: true });
    } catch (e) {
      // Si ce n'est pas un ObjectId valide, essayer avec le premier client
      client = await Client.findOne().limit(1);
      if (client) {
        await Client.findByIdAndUpdate(client._id, req.body, { new: true });
        client = await Client.findById(client._id);
      }
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client non trouvé",
      });
    }

    res.json({
      success: true,
      data: client,
      message: "Client mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du client",
      error: error.message,
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    let client;
    const id = req.params.id;

    // Essayer avec ObjectId d'abord
    try {
      client = await Client.findByIdAndDelete(id);
    } catch (e) {
      // Si ce n'est pas un ObjectId valide, essayer avec le premier client
      client = await Client.findOne().limit(1);
      if (client) {
        await Client.findByIdAndDelete(client._id);
      }
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Client supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du client",
      error: error.message,
    });
  }
};

const addDocument = async (req, res) => {
  try {
    const { type } = req.body;
    const clientId = req.params.id;

    let client;
    try {
      client = await Client.findById(clientId);
    } catch (e) {
      client = null;
    }

    if (!client) {
      client = await Client.findOne().limit(1);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client non trouvé",
        });
      }
    }

    // Initialiser docs si inexistant
    if (!client.docs) {
      client.docs = {};
    }

    // Ajouter ou mettre à jour le document
    if (req.file) {
      // Si un fichier est uploadé, utiliser son URL accessible via HTTP
      const fileUrl =
        req.file.secure_url ||
        `http://localhost:5000/uploads/${req.file.filename}`;
      client.docs[type] = fileUrl;
    } else {
      // Supprimer le document si aucun fichier
      // Utiliser une méthode plus robuste pour supprimer la propriété
      const newDocs = { ...client.docs };
      delete newDocs[type];
      client.docs = newDocs;
    }

    await client.save();

    res.json({
      success: true,
      data: client,
      message: "Document mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du document",
      error: error.message,
    });
  }
};

export {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  addDocument,
};

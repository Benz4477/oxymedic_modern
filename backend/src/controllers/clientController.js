import Client from "../models/Client.js";

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client non trouvé" });
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ success: true, data: client, message: "Client créé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ success: false, message: "Client non trouvé" });
    res.json({ success: true, data: client, message: "Client mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client non trouvé" });
    res.json({ success: true, message: "Client supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addDocument = async (req, res) => {
  try {
    const { type } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client non trouvé" });
    if (!client.docs) client.docs = {};
    if (req.file) {
      client.docs[type] = req.file.secure_url || `http://localhost:5000/uploads/${req.file.filename}`;
    } else {
      const newDocs = { ...client.docs };
      delete newDocs[type];
      client.docs = newDocs;
    }
    await client.save();
    res.json({ success: true, data: client, message: "Document mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllClients, getClientById, createClient, updateClient, deleteClient, addDocument };
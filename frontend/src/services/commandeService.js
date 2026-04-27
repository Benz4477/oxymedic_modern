import api from '../api';

const getAllCommandes = async () => {
  const response = await api.get('/commandes');
  return response.data;
};

const getCommandeById = async (id) => {
  const response = await api.get(`/commandes/${id}`);
  return response.data;
};

const createCommande = async (commandeData) => {
  const response = await api.post('/commandes', commandeData);
  return response.data;
};

const updateCommande = async (id, commandeData) => {
  const response = await api.put(`/commandes/${id}`, commandeData);
  return response.data;
};

const deleteCommande = async (id) => {
  const response = await api.delete(`/commandes/${id}`);
  return response.data;
};

export default {
  getAllCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande
};

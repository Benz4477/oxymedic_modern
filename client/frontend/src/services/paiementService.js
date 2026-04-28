import api from '../api';

const getAllPaiements = async () => {
  const response = await api.get('/paiements');
  return response.data;
};

const getPaiementById = async (id) => {
  const response = await api.get(`/paiements/${id}`);
  return response.data;
};

const createPaiement = async (paiementData) => {
  const response = await api.post('/paiements', paiementData);
  return response.data;
};

const updatePaiement = async (id, paiementData) => {
  const response = await api.put(`/paiements/${id}`, paiementData);
  return response.data;
};

const deletePaiement = async (id) => {
  const response = await api.delete(`/paiements/${id}`);
  return response.data;
};

export default {
  getAllPaiements,
  getPaiementById,
  createPaiement,
  updatePaiement,
  deletePaiement,
};

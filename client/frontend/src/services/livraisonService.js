import api from '../api';

const getAllLivraisons = async () => {
  const response = await api.get('/livraisons');
  return response.data;
};

const getLivraisonById = async (id) => {
  const response = await api.get(`/livraisons/${id}`);
  return response.data;
};

const createLivraison = async (livraisonData) => {
  const response = await api.post('/livraisons', livraisonData);
  return response.data;
};

const updateLivraison = async (id, livraisonData) => {
  const response = await api.put(`/livraisons/${id}`, livraisonData);
  return response.data;
};

const deleteLivraison = async (id) => {
  const response = await api.delete(`/livraisons/${id}`);
  return response.data;
};

export default {
  getAllLivraisons,
  getLivraisonById,
  createLivraison,
  updateLivraison,
  deleteLivraison,
};

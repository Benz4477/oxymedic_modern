import api from '../api';

const getAllLivreurs = async () => {
  const response = await api.get('/livreurs');
  return response.data;
};

const getLivreurById = async (id) => {
  const response = await api.get(`/livreurs/${id}`);
  return response.data;
};

const createLivreur = async (livreurData) => {
  const response = await api.post('/livreurs', livreurData);
  return response.data;
};

const updateLivreur = async (id, livreurData) => {
  const response = await api.put(`/livreurs/${id}`, livreurData);
  return response.data;
};

const deleteLivreur = async (id) => {
  const response = await api.delete(`/livreurs/${id}`);
  return response.data;
};

export default {
  getAllLivreurs,
  getLivreurById,
  createLivreur,
  updateLivreur,
  deleteLivreur,
};

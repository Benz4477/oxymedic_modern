import api from '../api';

const getAllDevis = async () => {
  const response = await api.get('/devis');
  return response.data;
};

const getDevisById = async (id) => {
  const response = await api.get(`/devis/${id}`);
  return response.data;
};

const createDevis = async (devisData) => {
  const response = await api.post('/devis', devisData);
  return response.data;
};

const updateDevis = async (id, devisData) => {
  const response = await api.put(`/devis/${id}`, devisData);
  return response.data;
};

const deleteDevis = async (id) => {
  const response = await api.delete(`/devis/${id}`);
  return response.data;
};

export default {
  getAllDevis,
  getDevisById,
  createDevis,
  updateDevis,
  deleteDevis,
};

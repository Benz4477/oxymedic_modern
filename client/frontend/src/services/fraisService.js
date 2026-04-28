import api from '../api';

const getAllFrais = async () => {
  const response = await api.get('/frais');
  return response.data;
};

const getFraisById = async (id) => {
  const response = await api.get(`/frais/${id}`);
  return response.data;
};

const createFrais = async (fraisData) => {
  const response = await api.post('/frais', fraisData);
  return response.data;
};

const updateFrais = async (id, fraisData) => {
  const response = await api.put(`/frais/${id}`, fraisData);
  return response.data;
};

const deleteFrais = async (id) => {
  const response = await api.delete(`/frais/${id}`);
  return response.data;
};

export default {
  getAllFrais,
  getFraisById,
  createFrais,
  updateFrais,
  deleteFrais,
};

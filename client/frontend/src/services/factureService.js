import api from '../api';

const getAllFactures = async () => {
  const response = await api.get('/factures');
  return response.data;
};

const getFactureById = async (id) => {
  const response = await api.get(`/factures/${id}`);
  return response.data;
};

const createFacture = async (factureData) => {
  const response = await api.post('/factures', factureData);
  return response.data;
};

const updateFacture = async (id, factureData) => {
  const response = await api.put(`/factures/${id}`, factureData);
  return response.data;
};

const deleteFacture = async (id) => {
  const response = await api.delete(`/factures/${id}`);
  return response.data;
};

export default {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
};

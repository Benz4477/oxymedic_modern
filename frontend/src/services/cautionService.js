import api from '../api';

const getAllCautions = async () => {
  const response = await api.get('/cautions');
  return response.data;
};

const getCautionById = async (id) => {
  const response = await api.get(`/cautions/${id}`);
  return response.data;
};

const createCaution = async (cautionData) => {
  const response = await api.post('/cautions', cautionData);
  return response.data;
};

const updateCaution = async (id, cautionData) => {
  const response = await api.put(`/cautions/${id}`, cautionData);
  return response.data;
};

const deleteCaution = async (id) => {
  const response = await api.delete(`/cautions/${id}`);
  return response.data;
};

export default {
  getAllCautions,
  getCautionById,
  createCaution,
  updateCaution,
  deleteCaution,
};

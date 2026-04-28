import api from '../api';

const getAllSerials = async () => {
  const response = await api.get('/serials');
  return response.data;
};

const getSerialById = async (id) => {
  const response = await api.get(`/serials/${id}`);
  return response.data;
};

const createSerial = async (serialData) => {
  const response = await api.post('/serials', serialData);
  return response.data;
};

const updateSerial = async (id, serialData) => {
  const response = await api.put(`/serials/${id}`, serialData);
  return response.data;
};

const deleteSerial = async (id) => {
  const response = await api.delete(`/serials/${id}`);
  return response.data;
};

export default {
  getAllSerials,
  getSerialById,
  createSerial,
  updateSerial,
  deleteSerial,
};

import api from '../api';

const getAllEquipements = async () => {
  const response = await api.get('/stock');
  return response.data;
};

const getEquipementById = async (id) => {
  const response = await api.get(`/stock/${id}`);
  return response.data;
};

const createEquipement = async (equipementData) => {
  const response = await api.post('/stock', equipementData);
  return response.data;
};

const updateEquipement = async (id, equipementData) => {
  const response = await api.put(`/stock/${id}`, equipementData);
  return response.data;
};

const deleteEquipement = async (id) => {
  const response = await api.delete(`/stock/${id}`);
  return response.data;
};

export default {
  getAllEquipements,
  getEquipementById,
  createEquipement,
  updateEquipement,
  deleteEquipement
};

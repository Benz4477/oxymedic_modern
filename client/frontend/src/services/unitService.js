import api from '../api';

const getAllUnits = async () => {
  const response = await api.get('/units');
  return response.data;
};

const getUnitById = async (id) => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

const createUnit = async (unitData) => {
  const response = await api.post('/units', unitData);
  return response.data;
};

const updateUnit = async (id, unitData) => {
  const response = await api.put(`/units/${id}`, unitData);
  return response.data;
};

const deleteUnit = async (id) => {
  const response = await api.delete(`/units/${id}`);
  return response.data;
};

export default {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};

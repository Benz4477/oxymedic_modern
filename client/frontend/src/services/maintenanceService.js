import api from '../api';

const getAllMaintenances = async () => {
  const response = await api.get('/maintenances');
  return response.data;
};

const getMaintenanceById = async (id) => {
  const response = await api.get(`/maintenances/${id}`);
  return response.data;
};

const createMaintenance = async (maintenanceData) => {
  const response = await api.post('/maintenances', maintenanceData);
  return response.data;
};

const updateMaintenance = async (id, maintenanceData) => {
  const response = await api.put(`/maintenances/${id}`, maintenanceData);
  return response.data;
};

const deleteMaintenance = async (id) => {
  const response = await api.delete(`/maintenances/${id}`);
  return response.data;
};

export default {
  getAllMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};

import api from '../api';

const getAllPermissions = async () => {
  const response = await api.get('/permissions');
  return response.data;
};

const getPermissionByModule = async (module) => {
  const response = await api.get(`/permissions/${module}`);
  return response.data;
};

const createPermission = async (permissionData) => {
  const response = await api.post('/permissions', permissionData);
  return response.data;
};

const updatePermission = async (module, permissionData) => {
  const response = await api.put(`/permissions/${module}`, permissionData);
  return response.data;
};

const deletePermission = async (module) => {
  const response = await api.delete(`/permissions/${module}`);
  return response.data;
};

export default {
  getAllPermissions,
  getPermissionByModule,
  createPermission,
  updatePermission,
  deletePermission,
};

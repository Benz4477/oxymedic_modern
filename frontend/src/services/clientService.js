import api from '../api';

const getAllClients = async () => {
  const response = await api.get('/clients');
  return response.data;
};

const getClientById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

export default {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};

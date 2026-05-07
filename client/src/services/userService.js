import api from "../api";

export const fetchActiveUsers = async () => {
  const response = await api.get("/users?status=active");
  return response.data.data || response.data;
};

export const fetchAllUsers = async () => {
  const response = await api.get("/users");
  return response.data.data || response.data;
};

export const fetchUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data || response.data;
};

// Alias utilisé par LoginScreen
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data || response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data.data || response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data.data || response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

const userService = {
  fetchActiveUsers,
  fetchAllUsers,
  fetchUserById,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
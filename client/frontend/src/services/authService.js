import api from '../api';

const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default {
  login,
  logout,
  getMe
};

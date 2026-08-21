import API from './api';

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await API.post('/auth/login', loginData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await API.post('/auth/forgot-password', resetData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

import api from './api';
import { storeToken, storeUserEmail } from './storageService';

// Função que chama o endpoint de login da API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  
  if (response.data.accessToken) {
    await storeToken(response.data.accessToken);
    await storeUserEmail(email);
  }
  
  return response.data;
};

// Função que chama o endpoint de registro da API
export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};
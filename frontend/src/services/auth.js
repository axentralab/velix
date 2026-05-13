import { apiClient } from './api.js';

export async function login(credentials) {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
}

export async function register(details) {
  const { data } = await apiClient.post('/auth/register', details);
  return data;
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(payload) {
  const { data } = await apiClient.post('/auth/reset-password', payload);
  return data;
}

export async function updateProfile(profileData) {
  const { data } = await apiClient.patch('/auth/profile', profileData);
  return data;
}

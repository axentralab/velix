import { apiClient } from './api.js';

export async function createOrder(orderData) {
  const { data } = await apiClient.post('/orders', orderData);
  return data;
}

export async function getUserOrders() {
  const { data } = await apiClient.get('/orders');
  return data;
}

export async function getOrder(orderNumber) {
  const { data } = await apiClient.get(`/orders/${orderNumber}`);
  return data;
}
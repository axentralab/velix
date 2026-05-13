import { apiClient } from './api.js';

// ── Order Services ──

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

// ── Admin Order Services ──

export async function getAllOrders() {
  const { data } = await apiClient.get('/admin/orders');
  return data;
}

export async function updateOrderStatus(orderNumber, status) {
  const { data } = await apiClient.patch(`/admin/orders/${orderNumber}/status`, { status });
  return data;
}

export async function confirmOrder(orderNumber) {
  const { data } = await apiClient.patch(`/admin/orders/${orderNumber}/confirm`);
  return data;
}

// ── Shipment Services ──

export async function createShipment(orderNumber, shipmentData) {
  const { data } = await apiClient.post('/admin/shipments', {
    orderNumber,
    ...shipmentData,
  });
  return data;
}

export async function getShipmentTracking(orderNumber) {
  const { data } = await apiClient.get(`/shipments/${orderNumber}`);
  return data;
}

// ── Payment Services ──

export async function verifyPayment(orderNumber, paymentData) {
  const { data } = await apiClient.post(`/admin/payments/${orderNumber}/verify`, paymentData);
  return data;
}

export async function rejectPayment(orderNumber, reason) {
  const { data } = await apiClient.post(`/admin/payments/${orderNumber}/reject`, { reason });
  return data;
}

// ── Refund Services ──

export async function getAllRefunds() {
  const { data } = await apiClient.get('/admin/refunds');
  return data;
}

export async function approveRefund(refundId, adminNotes) {
  const { data } = await apiClient.patch(`/admin/refunds/${refundId}/approve`, { adminNotes });
  return data;
}

export async function requestRefund(orderNumber, reason) {
  const { data } = await apiClient.post('/refunds', { orderNumber, reason });
  return data;
}

// ── Analytics Services ──

export async function getAnalyticsSales() {
  const { data } = await apiClient.get('/admin/analytics/sales');
  return data;
}

export async function getAnalyticsSummary() {
  const { data } = await apiClient.get('/admin/analytics/summary');
  return data;
}

export async function getAdminOrder(orderNumber) {
  const { data } = await apiClient.get(`/admin/orders/${orderNumber}`);
  return data;
}

export async function getAllShipments() {
  const { data } = await apiClient.get('/admin/shipments');
  return data;
}

export async function updateShipment(shipmentId, shipmentData) {
  const { data } = await apiClient.patch(`/admin/shipments/${shipmentId}`, shipmentData);
  return data;
}

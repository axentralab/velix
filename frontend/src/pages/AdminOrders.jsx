import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAllOrders, confirmOrder, createShipment } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';
import Loader from '../components/common/Loader.jsx';
import { FiEdit2, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';
const ORDER_STATUSES = ['pending_payment', 'payment_verified', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

function getStatusColor(status) {
  switch (status) {
    case 'pending_payment': return 'bg-red-100 text-red-800';
    case 'payment_verified': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-yellow-100 text-yellow-800';
    case 'packed': return 'bg-purple-100 text-purple-800';
    case 'shipped': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-emerald-100 text-emerald-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showShipmentForm, setShowShipmentForm] = useState(null);
  const [shipmentData, setShipmentData] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData);
      } catch (err) {
        setError('Unable to load orders. Please check your credentials.');
        console.error('Admin orders fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderNumber) => {
    try {
      await confirmOrder(orderNumber);
      setOrders((prev) => prev.map((order) => (
        order.orderNumber === orderNumber ? { ...order, orderStatus: 'processing' } : order
      )));
    } catch (err) {
      console.error('Order confirmation failed:', err);
      alert('Failed to confirm order.');
    }
  };

  const handleCreateShipment = async (orderNumber) => {
    try {
      await createShipment(orderNumber, shipmentData[orderNumber]);
      setOrders((prev) => prev.map((order) => (
        order.orderNumber === orderNumber ? { ...order, orderStatus: 'shipped' } : order
      )));
      setShowShipmentForm(null);
      setShipmentData({});
    } catch (err) {
      console.error('Shipment creation failed:', err);
      alert('Failed to create shipment.');
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter((o) => o.orderStatus === filterStatus);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Admin Access Required</h1>
        <p className="text-slate-600 mb-8">You must sign in with the admin account to view this page.</p>
        <Link
          to="/auth/login"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sign in as admin
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Order Management</h1>
          <p className="mt-2 text-slate-600">Manage all customer orders and track shipments.</p>
        </div>
        <Link
          to="/admin/payments"
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Payment Verification
        </Link>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filterStatus === 'all'
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                All Orders ({orders.length})
              </button>
              {ORDER_STATUSES.map((status) => {
                const count = orders.filter((o) => o.orderStatus === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition capitalize ${
                      filterStatus === status
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {status.replace(/_/g, ' ')} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-700">
              No orders found.
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-[0.2em] text-xs">
                    <tr>
                      <th className="px-6 py-4">Order #</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderNumber} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold text-slate-950">{order.orderNumber}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-950">{order.customer?.name}</p>
                            <p className="text-xs text-slate-500">{order.customer?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-950">{formatPrice(order.pricing?.total)}</td>
                        <td className="px-6 py-4 text-slate-600 capitalize">{order.payment?.method}</td>
                        <td className="px-6 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {order.orderStatus === 'pending_payment' && (
                              <button
                                onClick={() => navigate(`/admin/payments?order=${order.orderNumber}`)}
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                              >
                                <FiCheckCircle size={14} /> Verify
                              </button>
                            )}
                            {order.orderStatus === 'payment_verified' && (
                              <button
                                onClick={() => handleConfirmOrder(order.orderNumber)}
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition"
                              >
                                <FiCheckCircle size={14} /> Confirm
                              </button>
                            )}
                            {order.orderStatus === 'processing' && (
                              <button
                                onClick={() => setShowShipmentForm(order.orderNumber)}
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                              >
                                <FiTruck size={14} /> Ship
                              </button>
                            )}
                            <Link
                              to={`/admin/orders/${order.orderNumber}`}
                              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
                            >
                              <FiEdit2 size={14} /> View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shipment Modal */}
      {showShipmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-3xl bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-950 mb-6">Create Shipment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-950 mb-2">Courier</label>
                <select
                  value={shipmentData[showShipmentForm]?.courier || ''}
                  onChange={(e) => setShipmentData({
                    ...shipmentData,
                    [showShipmentForm]: { ...shipmentData[showShipmentForm], courier: e.target.value }
                  })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="">Select courier</option>
                  <option value="Pathao">Pathao</option>
                  <option value="Steadfast">Steadfast</option>
                  <option value="RedX">RedX</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-950 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={shipmentData[showShipmentForm]?.trackingNumber || ''}
                  onChange={(e) => setShipmentData({
                    ...shipmentData,
                    [showShipmentForm]: { ...shipmentData[showShipmentForm], trackingNumber: e.target.value }
                  })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="Enter tracking number"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleCreateShipment(showShipmentForm)}
                  className="flex-1 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Create Shipment
                </button>
                <button
                  onClick={() => setShowShipmentForm(null)}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

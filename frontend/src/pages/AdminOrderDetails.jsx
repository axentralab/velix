import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAdminOrder, updateOrderStatus, confirmOrder } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';
import Loader from '../components/common/Loader.jsx';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminOrderDetails() {
  const { orderNumber } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getAdminOrder(orderNumber);
        setOrder(data);
      } catch (err) {
        setError('Unable to load order details.');
        console.error('Admin order detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await confirmOrder(orderNumber);
      setOrder((prev) => ({ ...prev, orderStatus: 'processing' }));
    } catch (err) {
      console.error(err);
      alert('Failed to confirm order.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(orderNumber, 'cancelled');
      setOrder((prev) => ({ ...prev, orderStatus: 'cancelled' }));
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkShipped = () => {
    navigate('/admin/shipping');
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Admin Access Required</h1>
        <p className="text-slate-600 mb-8">Sign in with the admin account to view this page.</p>
        <Link
          to="/admin/login"
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
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Order Details</h1>
        <p className="text-red-600 mb-8">{error || 'Order not found.'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Order #{order.orderNumber}</h1>
          <p className="mt-2 text-slate-600">Customer, payment, shipment and timeline details.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
          >
            Print Invoice
          </button>
          {order.orderStatus === 'payment_verified' && (
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Confirm Order
            </button>
          )}
          {order.orderStatus === 'processing' && (
            <button
              onClick={handleMarkShipped}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Mark Shipped
            </button>
          )}
          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Customer Information</h2>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Name</p>
                <p>{order.customer.name}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Email</p>
                <p>{order.customer.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Phone</p>
                <p>{order.customer.phone}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Order Date</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Shipping Address</h2>
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Ordered Products</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    {item.selectedSize && <p className="text-sm text-slate-600">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-sm text-slate-600">Color: {item.selectedColor}</p>}
                  </div>
                  <p className="font-semibold text-slate-950">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Payment & Tracking</h2>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Payment Method</p>
                <p className="capitalize">{order.payment.method}</p>
                {order.payment.transactionId && <p>Txn ID: {order.payment.transactionId}</p>}
                <p>Status: {order.payment.status || 'pending'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">Tracking ID</p>
                <p>{order.trackingNumber || 'Not assigned'}</p>
                <p className="mt-3">Courier: {order.courier || 'N/A'}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Timeline</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Current status</h2>
            <p className="mt-2 text-sm text-slate-600">{order.orderStatus?.replace(/_/g, ' ')}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
            <div className="mb-4 flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.pricing.subtotal)}</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span>Shipping</span>
              <span>{order.pricing.shipping === 0 ? 'Free' : formatPrice(order.pricing.shipping)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 font-semibold text-slate-950">
              <span>Total</span>
              <span>{formatPrice(order.pricing.total)}</span>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={() => navigate('/admin/orders')}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Orders
            </button>
            <button
              onClick={() => navigate('/admin/shipping')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              Open Shipping Panel
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';

export default function OrderDetails() {
  const { orderNumber } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setError('Please sign in to view order details');
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrder(orderNumber);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load order details. Please try again.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayStatus = order?.orderStatus || order?.status;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Order Details</h1>
        <p className="text-slate-600 mb-8">Please sign in to view your order details.</p>
        <Link
          to="/auth/login"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Order Details</h1>
        <p className="text-red-600 mb-8">{error || 'Order not found'}</p>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order details</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Order #{order.orderNumber}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(displayStatus)}`}>
                {displayStatus?.charAt(0).toUpperCase() + displayStatus?.slice(1)}
              </span>
              <span className="text-sm text-slate-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Customer Information</h2>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Shipping Address</h2>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-950">{item.name}</h3>
                    <p className="text-sm text-slate-600">
                      Quantity: {item.quantity}
                      {item.selectedSize && ` | Size: ${item.selectedSize}`}
                      {item.selectedColor && ` | Color: ${item.selectedColor}`}
                    </p>
                  </div>
                  <span className="font-medium text-slate-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice */}
          <div className="rounded-3xl bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">Invoice</h2>
            <div className="mt-4 grid gap-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.pricing.shipping === 0 ? 'Free' : formatPrice(order.pricing.shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-950 border-t border-slate-200 pt-3">
                <span>Total</span>
                <span>{formatPrice(order.pricing.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order Status</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${order.status === 'processing' ? 'bg-yellow-400' : order.status === 'shipped' ? 'bg-blue-400' : order.status === 'delivered' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-slate-950 capitalize">{displayStatus}</span>
            </div>
            {order.trackingNumber && (
              <div className="text-sm text-slate-600">
                <p><strong>Tracking Number:</strong></p>
                <p className="font-mono">{order.trackingNumber}</p>
              </div>
            )}
            <div className="text-sm text-slate-600">
              <p><strong>Payment Method:</strong></p>
              <p className="capitalize">{order.payment.method}</p>
              {order.payment.status && (
                <p className="capitalize">Status: {order.payment.status}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link
              to="/orders"
              className="w-full inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              ← Back to Orders
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Order History</h1>
        <p className="text-slate-600 mb-8">Please sign in to view your orders.</p>
        <Link
          to="/auth/login"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Order History</h1>
        <p className="text-red-600 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Order History</h1>
        <p className="mt-2 text-slate-600">Track your orders and view past purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex rounded-3xl border border-slate-200 bg-slate-50 px-8 py-6 text-slate-950 mb-6">
            <span className="text-sm uppercase tracking-[0.3em]">No orders yet</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-950 mb-4">Start your shopping journey</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Browse our collection and find something you'll love.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const displayStatus = order.orderStatus || order.status;
            return (
              <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-950">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(displayStatus)}`}>
                        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-slate-600 mt-1">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-semibold text-slate-950">
                    {formatPrice(order.pricing.total)}
                  </p>
                  <Link
                    to={`/orders/${order.orderNumber}`}
                    className="text-sm text-gold hover:text-gold/80 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

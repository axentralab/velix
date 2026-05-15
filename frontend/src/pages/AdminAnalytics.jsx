import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAnalyticsSummary, getAnalyticsSales } from '../services/orders.js';
import { formatPrice } from '../utils/formatPrice.js';
import Loader from '../components/common/Loader.jsx';
import { FiPackage, FiDollarSign, FiClock, FiTruck } from 'react-icons/fi';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryData, salesData] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsSales(),
        ]);
        setSummary(summaryData);
        setSales(salesData);
      } catch (err) {
        setError('Unable to load analytics.');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Admin Access Required</h1>
        <p className="text-slate-600 mb-8">You must sign in with the admin account.</p>
        <Link to="/admin/login" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
          Sign in
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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Analytics Dashboard</h1>
        <p className="mt-2 text-slate-600">Store performance and order insights</p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">{error}</div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-600">Total Orders</span>
                <FiPackage size={24} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-950">{summary?.totalOrders}</p>
              <p className="text-xs text-slate-500 mt-2">All time</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-600">Total Revenue</span>
                <FiDollarSign size={24} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-slate-950">{formatPrice(summary?.totalRevenue || 0)}</p>
              <p className="text-xs text-slate-500 mt-2">From completed orders</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-600">Pending Payment</span>
                <FiClock size={24} className="text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-slate-950">{summary?.pendingOrders}</p>
              <p className="text-xs text-slate-500 mt-2">Awaiting verification</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-600">In Transit</span>
                <FiTruck size={24} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-950">{summary?.shippedOrders}</p>
              <p className="text-xs text-slate-500 mt-2">On the way</p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950 mb-6">Sales (Last 30 Days)</h2>
            <div className="space-y-3">
              {sales.length === 0 ? (
                <p className="text-slate-600">No sales data available</p>
              ) : (
                sales.map((day) => {
                  const maxRevenue = Math.max(...sales.map((d) => d.revenue));
                  const barWidth = (day.revenue / maxRevenue) * 100;
                  return (
                    <div key={day._id} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-semibold text-slate-600">{day._id}</div>
                      <div className="flex-1 h-10 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-3"
                          style={{ width: `${barWidth}%` }}
                        >
                          {barWidth > 15 && (
                            <span className="text-xs font-semibold text-white">{formatPrice(day.revenue)}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm font-semibold text-slate-950">{day.orders} orders</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950 mb-6">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/admin/orders"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                📦 Order Management
              </Link>
              <Link
                to="/admin/payments"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                💰 Payment Verification
              </Link>
              <Link
                to="/admin/orders"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                🚚 Shipping Management
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

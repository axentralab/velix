import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getAnalyticsSummary, getAnalyticsSales } from '../services/orders.js';
import Loader from '../components/common/Loader.jsx';
import { formatPrice } from '../utils/formatPrice.js';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [summaryData, salesData] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsSales(),
        ]);
        setSummary(summaryData);
        setSales(salesData.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Admin Access Required</h1>
        <p className="text-slate-600 mb-8">Sign in with the admin account to access the OMS dashboard.</p>
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
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Quick OMS insights for orders, payments, and shipments.</p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">{error}</div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Revenue</p>
              <p className="mt-4 text-3xl font-bold text-slate-950">{formatPrice(summary?.revenue || 0)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pending Orders</p>
              <p className="mt-4 text-3xl font-bold text-slate-950">{summary?.pendingOrders ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Verified Payments</p>
              <p className="mt-4 text-3xl font-bold text-slate-950">{summary?.verifiedPayments ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Shipments Today</p>
              <p className="mt-4 text-3xl font-bold text-slate-950">{summary?.todayShipments ?? 0}</p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950 mb-4">Daily Sales</h2>
              <div className="space-y-4">
                {sales.length === 0 ? (
                  <p className="text-sm text-slate-600">No sales data available.</p>
                ) : (
                  sales.map((day) => (
                    <div key={day._id} className="grid grid-cols-[1fr_auto] gap-4 items-center rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{day._id}</p>
                        <p className="text-xs text-slate-500">{day.orders} orders</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-950">{formatPrice(day.revenue)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950 mb-4">Quick Actions</h2>
              <div className="grid gap-3">
                <Link to="/admin/orders" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-slate-800">
                  📦 Manage Orders
                </Link>
                <Link to="/admin/payments" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-slate-800">
                  💰 Verify Payments
                </Link>
                <Link to="/admin/shipping" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-slate-800">
                  🚚 Shipping Management
                </Link>
                <Link to="/admin/analytics" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-slate-800">
                  📊 Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

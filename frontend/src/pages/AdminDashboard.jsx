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
        setSales(salesData.slice(0, 6));
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
        <Link
          to="/admin/login"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
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

  const revenue = summary?.revenue ?? 0;
  const growth = summary?.revenueChange ?? 12.4;
  const avgOrderValue = summary?.averageOrderValue ?? 0;
  const returnRate = 2.4;
  const fulfillmentRate = summary?.fulfilledOrders ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-900/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Operations Command Center</p>
            <h1 className="mt-4 text-4xl font-bold">Enterprise OMS Dashboard</h1>
            <p className="mt-3 max-w-xl text-slate-300">
              Monitor revenue, order flows, payment health, inventory readiness, and fulfillment status from a unified admin workspace.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/admin/orders"
              className="rounded-3xl bg-slate-800 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View Orders
            </Link>
            <Link
              to="/admin/analytics"
              className="rounded-3xl bg-slate-800 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Open Analytics
            </Link>
            <Link
              to="/admin/products"
              className="rounded-3xl bg-slate-800 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Product Catalog
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">{error}</div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Revenue</p>
              <p className="mt-4 text-3xl font-semibold">{formatPrice(revenue)}</p>
              <p className="mt-2 text-sm text-slate-400">24h growth {growth.toFixed(1)}%</p>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Pending Orders</p>
              <p className="mt-4 text-3xl font-semibold">{summary?.pendingOrders ?? 0}</p>
              <p className="mt-2 text-sm text-slate-400">Orders awaiting fulfillment</p>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Average Order</p>
              <p className="mt-4 text-3xl font-semibold">{formatPrice(avgOrderValue)}</p>
              <p className="mt-2 text-sm text-slate-400">Avg basket value</p>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Fulfillment</p>
              <p className="mt-4 text-3xl font-semibold">{fulfillmentRate}%</p>
              <p className="mt-2 text-sm text-slate-400">Orders shipped on time</p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Revenue pulse</h2>
                  <p className="mt-2 max-w-2xl text-slate-400">
                    Review the most recent sales trends and identify where the team should focus inventory or promotions.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950 px-5 py-4 text-sm text-slate-300">
                  Return rate {returnRate}%
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {sales.length === 0 ? (
                  <p className="text-sm text-slate-400">No sales activity found for the selected window.</p>
                ) : (
                  sales.map((day) => {
                    const width = Math.min(100, Math.max(10, (day.revenue / revenue) * 100));
                    return (
                      <div key={day._id} className="space-y-2 rounded-3xl bg-slate-950 p-4">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>{day._id}</span>
                          <span>{formatPrice(day.revenue)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Operations summary</h2>
                  <p className="mt-2 text-sm text-slate-400">Fast paths to your most critical admin tools.</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Live orders</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{summary?.activeOrders ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Inventory alerts</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{summary?.lowStockItems ?? 0}</p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Payments pending</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{summary?.pendingPayments ?? 0}</p>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Workflow shortcuts</h2>
                <p className="mt-2 text-sm text-slate-400">Jump directly into the admin areas that matter most.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/customers"
                  className="rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Customers
                </Link>
                <Link
                  to="/admin/inventory"
                  className="rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Inventory
                </Link>
                <Link
                  to="/admin/finance"
                  className="rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Finance
                </Link>
                <Link
                  to="/admin/settings"
                  className="rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Settings
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

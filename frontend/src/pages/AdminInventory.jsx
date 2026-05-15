import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FiLayers } from 'react-icons/fi';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminInventory() {
  const { user } = useAuth();

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Admin Access Required</h1>
        <p className="text-slate-400 mb-8">Please sign in with the admin account to access inventory management.</p>
        <Link to="/admin/login" className="inline-flex items-center justify-center rounded-full bg-slate-700 px-8 py-4 text-sm font-semibold text-white hover:bg-slate-600">
          Sign in as admin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Inventory</p>
          <h1 className="text-4xl font-semibold text-white">Warehouse Overview</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
          <FiLayers size={18} /> New Inventory Alert
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Warehouse A</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">2,540 in stock</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Primary fulfillment center with high-priority reserves and auto-restock workflows.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Warehouse B</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">1,240 in stock</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Secondary dispatch location optimized for regional shipping and transfer routing.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Alerts</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Low stock: 12 SKUs</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Monitor threshold alerts, multi-warehouse transfers, and reserved inventory levels.</p>
        </div>
      </div>
    </div>
  );
}

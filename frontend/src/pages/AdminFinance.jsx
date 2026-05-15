import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FiCreditCard, FiDollarSign } from 'react-icons/fi';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@veloura.com';

export default function AdminFinance() {
  const { user } = useAuth();

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Admin Access Required</h1>
        <p className="text-slate-400 mb-8">Please sign in with the admin account to access finance reports.</p>
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
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Finance</p>
          <h1 className="text-4xl font-semibold text-white">Financial Operations</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400">
          <FiDollarSign size={18} /> Revenue Report
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Revenue</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">$45,210</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Total revenue this week, with trend insights and cashflow monitoring.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Expenses</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">$18,640</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Track costs, payouts, payment gateway fees, and COD reconciliation.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Transactions</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">245</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Processed transactions across gateways, settlements, refunds, and payouts.</p>
        </div>
      </div>
    </div>
  );
}

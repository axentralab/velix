import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiGlobe, FiMoon, FiPlus, FiSearch, FiUser, FiSun, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';

const quickButtons = [
  { label: 'Create Order', to: '/admin/orders' },
  { label: 'Add Product', to: '/admin/products' },
  { label: 'Add Customer', to: '/admin/customers' },
];

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const initials = useMemo(() => {
    if (!user?.name) return 'AD';
    return user.name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user]);

  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur-xl lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-sm shadow-slate-950/10">
          <FiSearch className="text-slate-400" />
          <input
            type="search"
            placeholder="Search orders, customers, invoices..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800">
            <FiBell size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800">
            <FiGlobe size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800">
            <FiSun size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800">
            <FiMoon size={18} />
          </button>
          <div className="relative flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-slate-950/20">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name || 'Admin User'}</p>
              <p className="truncate text-xs text-slate-500">Administrator</p>
            </div>
            <FiChevronDown className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {quickButtons.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              <FiPlus size={16} />
              {action.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <span className="rounded-full bg-slate-900 px-3 py-2">Live</span>
          <span>Server status: <strong className="text-slate-200">Online</strong></span>
          <button onClick={logout} className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

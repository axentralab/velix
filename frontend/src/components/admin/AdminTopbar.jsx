import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiChevronDown, FiLogOut, FiPlus, FiSearch } from 'react-icons/fi';
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
    <div className="border-b border-slate-200 bg-white px-4 py-4 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[240px] flex-1 items-center gap-3 rounded-md border border-slate-200 bg-[#f3f4f1] px-4 py-3">
          <FiSearch className="text-slate-400" />
          <input
            type="search"
            placeholder="Search orders, customers, invoices..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
            <FiBell size={18} />
          </button>
          <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-lime-300">
              {initials}
            </span>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-black text-slate-950">{user?.name || 'Admin User'}</p>
              <p className="truncate text-xs text-slate-500">Administrator</p>
            </div>
            <FiChevronDown className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {quickButtons.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-lime-300 hover:text-slate-950"
            >
              <FiPlus size={15} />
              {action.label}
            </Link>
          ))}
        </div>
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
          <FiLogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}

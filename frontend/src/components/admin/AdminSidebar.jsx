import { NavLink } from 'react-router-dom';
import {
  FiBarChart2,
  FiBox,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiLayers,
  FiPackage,
  FiShield,
  FiShoppingBag,
  FiSettings,
  FiTruck,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

const menu = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: FiHome,
  },
  {
    label: 'Orders',
    to: '/admin/orders',
    icon: FiPackage,
  },
  {
    label: 'Payments',
    to: '/admin/payments',
    icon: FiDollarSign,
  },
  {
    label: 'Shipping',
    to: '/admin/shipping',
    icon: FiTruck,
  },
  {
    label: 'Analytics',
    to: '/admin/analytics',
    icon: FiBarChart2,
  },
  {
    label: 'Products',
    to: '/admin/products',
    icon: FiShoppingBag,
  },
  {
    label: 'Inventory',
    to: '/admin/inventory',
    icon: FiLayers,
  },
  {
    label: 'Customers',
    to: '/admin/customers',
    icon: FiUsers,
  },
  {
    label: 'Finance',
    to: '/admin/finance',
    icon: FiShield,
  },
  {
    label: 'Settings',
    to: '/admin/settings',
    icon: FiSettings,
  },
];

const quickActions = [
  { label: 'Create Order', to: '/admin/orders', icon: FiZap },
  { label: 'Add Product', to: '/admin/products', icon: FiBox },
  { label: 'Add Customer', to: '/admin/customers', icon: FiUsers },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-slate-800 bg-slate-950 px-5 py-6 text-slate-200 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-sky-500 text-white shadow-xl shadow-slate-900/20">
          <FiShield size={22} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">OMS Pro</p>
          <h1 className="text-xl font-semibold text-white">Order Studio</h1>
        </div>
      </div>

      <div className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-slate-800 text-white shadow-[inset_0_0_0_1px_rgba(148,163,184,0.24)]' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-slate-300">
                <Icon size={18} />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Quick actions</p>
        <div className="mt-4 space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <NavLink
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
                  <Icon size={18} />
                </span>
                {action.label}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-5 text-slate-300 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.06)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Enterprise Plan</p>
        <p className="mt-3 text-sm font-semibold text-white">Active until 26 Dec 2025</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" />
        </div>
        <p className="mt-2 text-xs text-slate-500">78% usage of your current plan</p>
      </div>
    </aside>
  );
}

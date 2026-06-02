import { NavLink } from 'react-router-dom';
import {
  FiBarChart2,
  FiBox,
  FiDollarSign,
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
  { label: 'Dashboard', to: '/admin/dashboard', icon: FiHome },
  { label: 'Orders', to: '/admin/orders', icon: FiPackage },
  { label: 'Payments', to: '/admin/payments', icon: FiDollarSign },
  { label: 'Shipping', to: '/admin/shipping', icon: FiTruck },
  { label: 'Analytics', to: '/admin/analytics', icon: FiBarChart2 },
  { label: 'Products', to: '/admin/products', icon: FiShoppingBag },
  { label: 'Inventory', to: '/admin/inventory', icon: FiLayers },
  { label: 'Customers', to: '/admin/customers', icon: FiUsers },
  { label: 'Finance', to: '/admin/finance', icon: FiShield },
  { label: 'Settings', to: '/admin/settings', icon: FiSettings },
];

const quickActions = [
  { label: 'Create Order', to: '/admin/orders', icon: FiZap },
  { label: 'Add Product', to: '/admin/products', icon: FiBox },
  { label: 'Add Customer', to: '/admin/customers', icon: FiUsers },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-4 py-5 text-slate-700 lg:block">
      <div className="mb-7 flex items-center gap-3 rounded-lg bg-slate-950 p-4 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lime-300 text-slate-950">
          <FiShield size={21} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Veloura</p>
          <h1 className="text-lg font-black">Admin Studio</h1>
        </div>
      </div>

      <div className="space-y-1.5">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                  isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-7 rounded-lg border border-slate-200 bg-[#f3f4f1] p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Quick actions</p>
        <div className="mt-4 space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <NavLink
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-950 hover:text-white"
              >
                <Icon size={16} />
                {action.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

import { Outlet, NavLink } from 'react-router-dom';

const menu = [
  { label: 'Overview', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-900/90 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <span className="text-xl font-semibold">Dashboard</span>
          <div className="flex items-center gap-4">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive ? 'bg-gold text-slate-950' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </div>
    </div>
  );
}

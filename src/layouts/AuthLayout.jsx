import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-700 p-8 shadow-2xl shadow-slate-900/20">
        <Outlet />
      </div>
    </div>
  );
}

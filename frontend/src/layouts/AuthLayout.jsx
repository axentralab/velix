import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#d8ff36_0,#f3f4f1_28%,#111827_72%)] px-4 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/15 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <Outlet />
      </div>
    </div>
  );
}

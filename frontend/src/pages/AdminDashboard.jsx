export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-3">
        {['Total sales', 'Orders', 'Revenue'].map((item) => (
          <div key={item} className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item}</p>
            <p className="mt-4 text-3xl font-bold">$45.2k</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="mt-4 text-sm text-slate-400">A simple analytics overview can be expanded with charts, revenue trends, and order summaries.</p>
      </div>
    </div>
  );
}

export default function Input({ label, className = '', as = 'input', ...props }) {
  const Component = as;

  return (
    <label className="block text-sm text-slate-800">
      {label && <span className="mb-2 block text-sm font-medium">{label}</span>}
      <Component
        className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 ${className}`}
        {...props}
      />
    </label>
  );
}

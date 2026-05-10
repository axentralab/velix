export default function ProductManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold text-white">Product Management</h1>
        <button className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-yellow-400">
          Add product
        </button>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-xl">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {Array.from({ length: 4 }, (_, index) => (
              <tr key={index} className="hover:bg-slate-950/30">
                <td className="px-6 py-4">Product {index + 1}</td>
                <td className="px-6 py-4">In stock</td>
                <td className="px-6 py-4">$199</td>
                <td className="px-6 py-4">
                  <button className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-gold">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

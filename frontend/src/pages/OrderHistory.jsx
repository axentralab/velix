import { useProducts } from '../contexts/ProductContext.jsx';
import Loader from '../components/common/Loader.jsx';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
  const { products, loading, error } = useProducts();

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Orders</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Your order history</h1>
      </div>
      <div className="space-y-6">
        {products.slice(0, 3).map((order) => (
          <Link key={order.id} to={`/order/${order.id}`} className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">Order #{order.id}</p>
                <p className="text-sm text-slate-500">Placed on Apr 24, 2026</p>
              </div>
              <div className="text-sm text-slate-600">
                <p>Total: ${order.price + 60}.00</p>
                <p className="mt-1 text-slate-400">Status: Delivered</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

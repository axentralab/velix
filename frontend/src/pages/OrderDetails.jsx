import { useParams } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';

export default function OrderDetails() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;

  const order = products.find((item) => item.id === id) || products[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order details</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Order #{order.id}</h1>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <p>Placed on April 24, 2026</p>
            <p>Shipping address: 125 Luxury Ave, New York, NY</p>
            <p>Status: Delivered</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">Invoice</h2>
            <div className="mt-4 grid gap-4 text-sm">
              <div className="flex justify-between"><span>{order.name}</span><span>${order.price}.00</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$15.00</span></div>
              <div className="flex justify-between font-semibold text-slate-950"><span>Total</span><span>${order.price + 15}.00</span></div>
            </div>
          </div>
        </div>
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Tracking</p>
          <div className="space-y-4 text-sm text-slate-600">
            <p>Your order is on the way and will arrive in 2–3 business days.</p>
            <p>Tracking number: VELIX-2026-100{id}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

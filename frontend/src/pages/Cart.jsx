import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity } from '../redux/slices/cartSlice.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-slate-950">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-950">{item.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-900"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                  >
                    -
                  </button>
                  <span className="text-sm text-slate-900">{item.quantity}</span>
                  <button
                    className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-900"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  >
                    +
                  </button>
                </div>
                <button
                  className="rounded-full border border-rose-400 px-4 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-slate-950">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-yellow-400">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { removeItem, updateQuantity } from '../redux/slices/cartSlice.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="page-shell py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Shopping bag</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Your cart</h1>
        </div>
        <Link to="/shop" className="btn-secondary">Continue shopping</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="surface rounded-lg p-12 text-center">
              <FiShoppingBag className="mx-auto text-slate-300" size={42} />
              <p className="mt-4 text-lg font-bold text-slate-950">Your cart is empty</p>
              <p className="mt-2 text-sm text-slate-500">Add a few favorites and they will show up here.</p>
              <Link to="/shop" className="btn-primary mt-6">Start shopping</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="surface grid gap-4 rounded-lg p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-lg object-cover" />
                <div>
                  <h2 className="text-lg font-black text-slate-950">{item.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <div className="flex items-center rounded-md border border-slate-200 bg-white">
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-100"
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={15} />
                    </button>
                    <span className="min-w-10 text-center text-sm font-bold text-slate-950">{item.quantity}</span>
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-100"
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={15} />
                    </button>
                  </div>
                  <button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50"
                    onClick={() => dispatch(removeItem(item.id))}
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="surface h-fit rounded-lg p-6">
          <h2 className="text-xl font-black text-slate-950">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-950">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between text-lg font-black text-slate-950">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary mt-8 w-full">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

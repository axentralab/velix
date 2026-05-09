import Input from '../components/common/Input.jsx';

export default function Checkout() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Checkout</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">Shipping & payment</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Full name" placeholder="Enter your name" />
            <Input label="Phone" placeholder="Phone number" />
            <Input label="Email" placeholder="Email address" type="email" />
            <Input label="Address" placeholder="Street address" />
          </div>
          <div className="space-y-4 rounded-3xl bg-slate-50 p-6 text-slate-700">
            <h2 className="text-xl font-semibold text-slate-950">Payment</h2>
            <p className="text-sm">Enter your payment details during integration with Stripe or your chosen gateway.</p>
          </div>
        </section>
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order summary</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">3 items, premium shipping</p>
          </div>
          <div className="space-y-3 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$625.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-950">
              <span>Total</span>
              <span>$625.00</span>
            </div>
          </div>
          <button className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-yellow-400">
            Place order
          </button>
        </aside>
      </div>
    </div>
  );
}

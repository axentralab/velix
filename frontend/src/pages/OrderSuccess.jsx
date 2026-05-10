import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <div className="inline-flex rounded-3xl border border-gold/30 bg-gold/5 px-8 py-6 text-slate-950">
        <p className="text-sm uppercase tracking-[0.3em]">Order confirmed</p>
      </div>
      <h1 className="mt-8 text-5xl font-bold text-slate-950">Thank you for your purchase.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 mx-auto">
        Your order is being prepared. We will send tracking details to your inbox shortly.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/orders" className="rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
          View orders
        </Link>
        <Link to="/shop" className="rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

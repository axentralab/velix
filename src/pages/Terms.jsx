export default function Terms() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-4xl font-bold text-slate-950">Terms & Conditions</h1>
      <p className="mt-6 text-sm leading-7 text-slate-600">
        By using FashionHub, you agree to our terms of service, payment terms, and product return policy.
      </p>
      <section className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Purchases</h2>
          <p className="mt-3 text-sm text-slate-600">All orders are subject to availability and confirmation of payment.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Delivery</h2>
          <p className="mt-3 text-sm text-slate-600">Delivery timelines vary by region and shipping method selected.</p>
        </div>
      </section>
    </div>
  );
}

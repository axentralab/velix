export default function Privacy() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-bold text-slate-950">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-7 text-slate-600">
        At FashionHub, we collect only the information necessary to process your orders and improve your shopping experience.
      </p>
      <section className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Data Collection</h2>
          <p className="mt-3 text-sm text-slate-600">Personal details are saved securely and never sold to third parties.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Cookies</h2>
          <p className="mt-3 text-sm text-slate-600">Cookies enhance the browsing experience and support analytics.</p>
        </div>
      </section>
    </div>
  );
}

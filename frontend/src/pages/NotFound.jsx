import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-gray-400">Page not found</p>
      <h1 className="mt-5 text-4xl font-black text-slate-900">404 — Sorry, we can’t find that page.</h1>
      <p className="mt-4 text-sm text-slate-600">The link may be invalid or the page has been moved.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-black"
      >
        Return to home
      </Link>
    </div>
  );
}

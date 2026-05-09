import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-700">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-slate-950">Velix</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            A premium fashion destination built with luxury energy, smooth motion, and clean product storytelling.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <NavLink to="/shop" className="hover:text-slate-950">Shop</NavLink>
            <NavLink to="/blog" className="hover:text-slate-950">Blog</NavLink>
            <NavLink to="/about" className="hover:text-slate-950">About</NavLink>
            <NavLink to="/contact" className="hover:text-slate-950">Contact</NavLink>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Support</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <NavLink to="/faq" className="hover:text-slate-950">FAQ</NavLink>
            <NavLink to="/privacy" className="hover:text-slate-950">Privacy</NavLink>
            <NavLink to="/terms" className="hover:text-slate-950">Terms</NavLink>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © 2026 Velix. All rights reserved.
      </div>
    </footer>
  );
}

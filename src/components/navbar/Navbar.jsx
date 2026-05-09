import { NavLink } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-2xl font-bold tracking-[0.15em] text-slate-950">
          Velix
        </NavLink>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-slate-700">
          <NavLink to="/wishlist" className="text-xl hover:text-slate-950">
            <FiHeart />
          </NavLink>
          <NavLink to="/cart" className="text-xl hover:text-slate-950">
            <FiShoppingBag />
          </NavLink>
          <NavLink
            to="/login"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-slate-600"
          >
            Sign in
          </NavLink>
        </div>
      </div>
    </header>
  );
}

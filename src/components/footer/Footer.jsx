import { NavLink } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-700">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-slate-950">FashionHub</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Affordable and trendy fashion for men, women, and kids. Quality clothing at great prices.
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
        <div>
          <p className="font-semibold text-slate-950">Follow Us</p>
          <div className="mt-4 flex gap-4">
            <a href="#" className="text-slate-600 hover:text-slate-950"><FiFacebook size={20} /></a>
            <a href="#" className="text-slate-600 hover:text-slate-950"><FiInstagram size={20} /></a>
            <a href="#" className="text-slate-600 hover:text-slate-950"><FiTwitter size={20} /></a>
            <a href="#" className="text-slate-600 hover:text-slate-950"><FiYoutube size={20} /></a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © 2026 FashionHub. All rights reserved.
      </div>
    </footer>
  );
}

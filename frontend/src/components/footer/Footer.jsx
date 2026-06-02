import { NavLink } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8 xl:grid-cols-4">
        <div>
          <p className="text-xl font-black tracking-[0.18em] text-white">VELOURA</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
            Fresh everyday fashion for men, women, and kids with fast delivery and easy returns.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <NavLink to="/shop" className="hover:text-white">Shop</NavLink>
            <NavLink to="/contact" className="hover:text-white">Contact</NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Support</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <NavLink to="/privacy" className="hover:text-white">Privacy</NavLink>
            <NavLink to="/terms" className="hover:text-white">Terms</NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">Follow Us</p>
          <div className="mt-4 flex gap-3">
            {[
              { href: '#', icon: FiFacebook, label: 'Facebook' },
              { href: '#', icon: FiInstagram, label: 'Instagram' },
              { href: '#', icon: FiTwitter, label: 'Twitter' },
              { href: '#', icon: FiYoutube, label: 'YouTube' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 text-slate-400 transition hover:border-lime-300 hover:text-lime-300"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
        (c) 2026 VELOURA. All rights reserved.
      </div>
    </footer>
  );
}

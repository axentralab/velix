import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-slate-400">Casual fashion</p>
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Affordable style for everyone.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Discover trendy t-shirts, polos, and accessories at unbeatable prices. Quality fashion for men, women, and kids.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-xl transition hover:bg-yellow-400">
                Shop now
              </Link>
              <Link to="/blog" className="rounded-full border border-slate-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white">
                Read journal
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-800 shadow-2xl shadow-slate-900/40">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80" alt="Casual fashion" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

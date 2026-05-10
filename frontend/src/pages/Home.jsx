import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiRefreshCw, FiShield, FiCreditCard } from 'react-icons/fi';
import { useState } from 'react';

const categories = [
  { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80', count: 24 },
  { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=900&q=80', count: 36 },
  { name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1503944168849-c1246463e59f?auto=format&fit=crop&w=900&q=80', count: 18 },
  { name: 'New Arrival', slug: 'new-arrival', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80', count: 12 },
];

const testimonials = [
  { name: 'Sophia M.', role: 'Fashion Blogger', rating: 5, text: 'Great quality at affordable prices. FashionHub has become my go-to for trendy clothes.' },
  { name: 'James R.', role: 'Creative Director', rating: 5, text: 'Love the variety for men, women, and kids. Fast shipping and easy returns.' },
  { name: 'Aria K.', role: 'Stylist', rating: 5, text: 'My clients love the styles. Comfortable and stylish pieces for everyday wear.' },
];

const perks = [
  { icon: <FiTruck size={22} />, title: 'Free Worldwide Shipping', desc: 'On all orders over $150' },
  { icon: <FiRefreshCw size={22} />, title: 'Easy Returns', desc: '14-day hassle-free returns' },
  { icon: <FiShield size={22} />, title: 'Authenticity Guarantee', desc: '100% genuine luxury pieces' },
  { icon: <FiCreditCard size={22} />, title: 'Secure Payments', desc: 'Bank-level SSL encryption' },
];

const brands = ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'H&M', 'Zara'];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  const { products, loading, error } = useProducts();
  const featured = products.slice(0, 4);
  const newArrivals = products.slice(2, 6);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <HeroSection />

      {/* App Banner */}
      <section className="bg-slate-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-lg font-semibold text-slate-950">GET 5% OFF ON APP</p>
          <p className="mt-2 text-sm text-slate-600">Download our app for exclusive deals and faster shopping.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="#" className="rounded-lg bg-black px-4 py-2 text-white text-sm">Download on App Store</a>
            <a href="#" className="rounded-lg bg-black px-4 py-2 text-white text-sm">Get it on Google Play</a>
          </div>
        </div>
      </section>

      {/* Perks Bar */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-gold">{perk.icon}</span>
              <p className="font-semibold text-slate-900">{perk.title}</p>
              <p className="text-xs text-slate-500">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">New arrivals</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Trending products</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-gold transition-colors">
            View all <FiArrowRight />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product, i) => (
            <motion.div key={product.id} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -4 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Category Showcase */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Collections</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Shop by category</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.slug} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link to={`/category/${cat.slug}`} className="group relative block overflow-hidden rounded-3xl">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={cat.image} alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xl font-bold text-white">{cat.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{cat.count} items</p>
                </div>
                <div className="absolute right-4 top-4 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <FiArrowRight size={16} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Story Banner */}
      <section className="overflow-hidden bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.7 }}>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Our story</p>
              <h2 className="mt-4 text-4xl font-black text-white lg:text-5xl">
                Fashion born from a desire to do things differently.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Velix was founded in 2019 with one belief: that luxury should be felt, not just worn.
                We source only the finest fabrics from artisan studios across Europe and Asia, creating pieces that outlast trends.
              </p>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:border-white">
                Our story <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                alt="Atelier" className="rounded-3xl object-cover aspect-square w-full" />
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
                alt="Craftsmanship" className="mt-8 rounded-3xl object-cover aspect-square w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals Row */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Just dropped</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">New arrivals</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-gold transition-colors">
            See collection <FiArrowRight />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product, i) => (
            <motion.div key={product.id} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -4 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="border-y border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-slate-400">Trusted by wearers of</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {brands.map((b) => (
              <span key={b} className="text-xl font-black uppercase tracking-tight text-slate-300 hover:text-slate-600 transition-colors cursor-default">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reviews</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">What our customers say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} fill="currentColor" size={14} />)}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 lg:p-16 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Stay in the loop</p>
          <h2 className="mt-4 text-4xl font-black text-white">Get exclusive drops & offers.</h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Subscribe and be the first to know about new collections, limited editions, and private sales.
          </p>
          {subscribed ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-slate-950">
              ✓ You're on the list!
            </p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              className="mt-8 flex max-w-md mx-auto flex-col gap-3 sm:flex-row">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-slate-700 bg-slate-800 px-6 py-4 text-sm text-white placeholder-slate-500 outline-none focus:border-gold" />
              <button type="submit"
                className="rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-yellow-400">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

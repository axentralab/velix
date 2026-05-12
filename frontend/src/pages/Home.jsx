import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiRefreshCw, FiShield, FiCreditCard, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { fetchCategories, fetchTestimonials } from '../services/sanity.js';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

// ── Category Banner Card (Fabrilife style) ──────────────────────────────────
function CategoryBanner({ image, label, link, tall = false }) {
  return (
    <Link to={link} className="group relative block overflow-hidden bg-gray-100">
      <div className={`${tall ? 'aspect-[3/5]' : 'aspect-[3/4]'} overflow-hidden`}>
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = `https://placehold.co/600x800/eeeeee/aaaaaa?text=${encodeURIComponent(label)}`; }}
        />
      </div>
      {/* Label at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-3 px-4 flex items-center justify-between">
        <span className="text-sm font-bold text-black uppercase tracking-wider">{label}</span>
        <FiChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// ── Section Header (Fabrilife style) ────────────────────────────────────────
function SectionHeader({ title, link, linkLabel = 'VIEW MORE' }) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
      <h2 className="text-xl font-black uppercase tracking-tight text-black">{title}</h2>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
        >
          {linkLabel} <FiArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { products, loading, error } = useProducts();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, tests] = await Promise.all([
          fetchCategories(),
          fetchTestimonials()
        ]);
        setCategories(cats);
        setTestimonials(tests);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!localStorage.getItem('homePopupClosed')) {
        setShowPopup(true);
      }
    }, 1400);

    return () => window.clearTimeout(timer);
  }, []);

  const closePopup = () => {
    localStorage.setItem('homePopupClosed', 'true');
    setShowPopup(false);
  };

  if (loading || dataLoading) return <Loader />;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  const topSelling = products.filter(p => p.topSelling).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);
  const menProducts = products.filter(p => p.gender === 'men').slice(0, 4);
  const womenProducts = products.filter(p => p.gender === 'women').slice(0, 4);
  const allProducts = products.slice(0, 8);

  // Category banners — use Sanity cats or fallback editorial images
  const catBanners = [
    {
      label: 'Men',
      link: '/shop?gender=men',
      image: categories.find(c => c.name?.toLowerCase().includes('men'))?.image
        || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    },
    {
      label: 'Women',
      link: '/shop?gender=women',
      image: categories.find(c => c.name?.toLowerCase().includes('women'))?.image
        || 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80',
    },
    {
      label: 'Hoodies',
      link: '/shop?category=hoodie',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    },
    {
      label: 'Sneakers',
      link: '/shop?category=shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    },
  ];

  const heroCategories = catBanners;

  return (
    <div className="bg-[#f6f5f1] text-gray-900">
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75 }}
              className="space-y-6"
            >
              <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white">
                Trendy Collection
              </span>
              <h1 className="text-5xl font-black tracking-tight text-gray-950 md:text-6xl xl:text-7xl">
                Stylish looks built for everyday life.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-gray-600">
                Discover premium streetwear and essentials from Bangladesh’s favorite fashion store. New drops, fast delivery, and effortless styling.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-gray-800"
                >
                  Shop All
                </Link>
                <Link
                  to="/shop?filter=new"
                  className="inline-flex items-center justify-center rounded-full border border-black px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
                >
                  New Arrivals
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Free Shipping</p>
                  <p className="mt-2 text-lg font-bold text-gray-950">৳ 2,000+ delivery</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Returns</p>
                  <p className="mt-2 text-lg font-bold text-gray-950">7 days easy return</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="relative overflow-hidden rounded-[2rem] bg-gray-100 shadow-[0_40px_80px_rgba(15,23,42,0.08)]"
            >
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80"
                alt="Fashion hero"
                className="h-[560px] w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          {heroCategories.map((cat, index) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <Link to={cat.link} className="block h-full">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{cat.label}</p>
                  <p className="mt-3 text-2xl font-black text-gray-950">Shop {cat.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {topSelling.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="Top Selling" link="/shop?filter=top" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topSelling.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            to="/shop?gender=women"
            className="group relative overflow-hidden rounded-[2rem] bg-gray-950"
          >
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80"
              alt="Women's wear"
              className="h-80 w-full object-cover object-center transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-8 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.35em] text-yellow-400">Women's Edit</span>
              <h2 className="mt-3 text-3xl font-black text-white">Fresh styles for her</h2>
              <p className="mt-3 max-w-sm text-sm text-gray-200">New season pieces with elegant silhouettes and everyday comfort.</p>
            </div>
          </Link>
          <Link
            to="/shop?category=hoodie"
            className="group relative overflow-hidden rounded-[2rem] bg-gray-950"
          >
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80"
              alt="Hoodie collection"
              className="h-80 w-full object-cover object-center transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-8 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.35em] text-yellow-400">Limited Drop</span>
              <h2 className="mt-3 text-3xl font-black text-white">Cozy hoodies</h2>
              <p className="mt-3 max-w-sm text-sm text-gray-200">Perfect layering for the season — easy to wear, easy to style.</p>
            </div>
          </Link>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="New Arrivals" link="/shop?filter=new" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {menProducts.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="Men's Picks" link="/shop?gender=men" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {menProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: <FiTruck size={20} />, title: 'Free Delivery', desc: '৳ 2,000+' },
              { icon: <FiRefreshCw size={20} />, title: 'Easy Return', desc: '7-day policy' },
              { icon: <FiShield size={20} />, title: 'Authentic', desc: 'Verified products' },
              { icon: <FiCreditCard size={20} />, title: 'Secure Pay', desc: 'Safe checkout' },
            ].map((perk, index) => (
              <div key={index} className="rounded-[2rem] border border-gray-200 bg-[#f6f5f1] p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                  {perk.icon}
                </div>
                <p className="mt-5 text-lg font-bold text-gray-950">{perk.title}</p>
                <p className="mt-2 text-sm text-gray-500">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="What customers say" />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="rounded-[2rem] border border-gray-200 bg-white p-6"
              >
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, star) => (
                    <FiStar key={star} fill="currentColor" size={14} />
                  ))}
                </div>
                <p className="text-sm leading-6 text-gray-600">"{t.review || t.text || 'Great product!'}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-black text-center leading-10 text-white text-sm font-bold">
                    {(t.name || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-950">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role || 'Verified customer'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-black text-white py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">Stay in the loop</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Subscribe for exclusive offers
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            Be the first to know about new arrivals, flash sales, and curated drops.
          </p>
          {subscribed ? (
            <p className="mt-8 inline-flex rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] text-black">
              ✓ You're subscribed!
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="w-full rounded-full border border-gray-700 bg-gray-900 px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 sm:max-w-md"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] text-black transition hover:bg-yellow-300"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 sm:px-6">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closePopup}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
              aria-label="Close advertisement"
            >
              ✕
            </button>
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-500">Special Offer</p>
              <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Summer Sale: Up to 30% Off</h2>
              <p className="mx-auto max-w-xl text-sm leading-6 text-gray-600">
                Enjoy fast delivery and limited-time prices on select fashion items. Tap below to shop trending styles now.
              </p>
              <Link
                to="/shop"
                onClick={closePopup}
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-gray-800"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

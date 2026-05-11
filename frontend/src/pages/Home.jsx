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

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — Full-width image with text overlay (Fabrilife style)        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="grid lg:grid-cols-2 min-h-[520px] lg:min-h-[600px]">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
            className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400 mb-4">
              New Collection 2025
            </p>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
              Because comfort and confidence go hand in hand.
            </h1>
            <p className="mt-5 text-base text-gray-400 max-w-md leading-relaxed">
              Premium quality clothing at honest prices. Shop men, women & kids fashion — delivered fast across Bangladesh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="bg-white text-black px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] hover:bg-yellow-400 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/shop?filter=new"
                className="border border-white/30 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] hover:border-white transition-colors"
              >
                New Arrivals
              </Link>
            </div>
          </motion.div>
          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&q=80"
              alt="Fashion hero"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ANNOUNCEMENT BAR                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-black text-white py-2.5 text-center text-xs font-bold uppercase tracking-[0.2em]">
        🚚 Free delivery on orders above ৳2,000 &nbsp;|&nbsp; Easy 7-day returns &nbsp;|&nbsp; 100% authentic products
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CATEGORY BANNERS — 4 column grid (Fabrilife signature)             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8">
        <SectionHeader title="Shop by Category" link="/shop" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {catBanners.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <CategoryBanner {...cat} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TOP SELLING PRODUCTS — 4 column grid                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {topSelling.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pb-10 lg:px-8">
          <SectionHeader title="🔥 Top Selling" link="/shop?filter=top" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {topSelling.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PROMO BANNER — Full width editorial (Fabrilife style)              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1400px] px-4 pb-10 lg:px-8">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Large promo left */}
          <Link to="/shop?gender=men" className="group relative overflow-hidden bg-gray-900 block">
            <img
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=900&q=80"
              alt="Men's Collection"
              className="h-64 w-full object-cover object-top opacity-80 transition-transform duration-700 group-hover:scale-105 lg:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 lg:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-1">Men's Fashion</p>
              <h3 className="text-2xl font-black text-white lg:text-3xl">New Season Arrivals</h3>
              <p className="text-sm text-gray-300 mt-1 mb-4">Tees, Hoodies, Cargo & More</p>
              <span className="inline-flex w-fit items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-[0.15em] px-5 py-2.5 group-hover:bg-yellow-400 transition-colors">
                Shop Men <FiArrowRight size={12} />
              </span>
            </div>
          </Link>
          {/* Right column — 2 small banners stacked */}
          <div className="grid grid-cols-1 gap-3">
            <Link to="/shop?gender=women" className="group relative overflow-hidden bg-gray-100 block">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
                alt="Women's Collection"
                className="h-40 w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 lg:h-[152px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-xl font-black text-white">Women's Collection</h3>
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Explore →</span>
              </div>
            </Link>
            <Link to="/shop?category=hoodie" className="group relative overflow-hidden bg-gray-100 block">
              <img
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80"
                alt="Hoodies"
                className="h-40 w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 lg:h-[152px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-xl font-black text-white">Hoodie Collection</h3>
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Explore →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* NEW ARRIVALS — 4 column grid                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pb-10 lg:px-8">
          <SectionHeader title="✨ New Arrivals" link="/shop?filter=new" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MEN'S PRODUCTS — 4 column grid                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {menProducts.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 pb-10 lg:px-8">
          <SectionHeader title="Men's Favourites" link="/shop?gender=men" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {menProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FULL CATALOGUE — 4 column grid with "View All" at end              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1400px] px-4 pb-10 lg:px-8">
        <SectionHeader title="All Products" link="/shop" linkLabel="View All" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
          {/* Fabrilife "VIEW MORE" card at end */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} transition={{ delay: 0.5 }}
          >
            <Link
              to="/shop"
              className="group relative flex aspect-[3/4] items-center justify-center bg-gray-950 overflow-hidden"
            >
              <div className="text-center z-10">
                <p className="text-white text-lg font-black uppercase tracking-tight">View All</p>
                <p className="text-white text-lg font-black uppercase tracking-tight">Products</p>
                <div className="mt-4 flex h-10 w-10 items-center justify-center border border-white/40 rounded-full mx-auto group-hover:bg-white group-hover:text-black text-white transition-all">
                  <FiArrowRight size={18} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PERKS BAR — horizontal strip                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { icon: <FiTruck size={20} />, title: 'Free Delivery', desc: 'Orders above ৳2,000' },
              { icon: <FiRefreshCw size={20} />, title: 'Easy Returns', desc: '7-day hassle-free' },
              { icon: <FiShield size={20} />, title: '100% Authentic', desc: 'Genuine products only' },
              { icon: <FiCreditCard size={20} />, title: 'Secure Payment', desc: 'SSL encrypted checkout' },
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-black text-white">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{perk.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
          <SectionHeader title="Customer Reviews" />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.12 }}
                className="border border-gray-200 bg-white p-6"
              >
                <div className="flex gap-0.5 text-yellow-400 mb-3">
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <FiStar key={j} fill="currentColor" size={14} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-6">"{t.review || t.text || 'Great product!'}"</p>
                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="h-9 w-9 flex-shrink-0 bg-black flex items-center justify-center text-white text-sm font-bold">
                    {(t.name || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role || 'Verified Customer'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* NEWSLETTER — dark, full width                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-black text-white py-14">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400 mb-3">Stay Updated</p>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Get Exclusive Deals & New Arrivals
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Subscribe for early access to sales, new collections, and special offers.
          </p>
          {subscribed ? (
            <p className="mt-8 inline-block bg-yellow-400 text-black px-8 py-3 text-sm font-bold uppercase tracking-widest">
              ✓ You're subscribed!
            </p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              className="mt-8 flex max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="flex-1 border border-gray-600 bg-gray-900 px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black px-6 py-3.5 text-sm font-bold uppercase tracking-[0.15em] hover:bg-yellow-300 transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

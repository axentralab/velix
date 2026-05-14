import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';
import { motion } from 'framer-motion';
import {
  FiArrowRight, FiStar, FiTruck, FiRefreshCw,
  FiShield, FiCreditCard, FiChevronRight, FiTag,
  FiZap, FiHeart, FiInstagram
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { fetchCategories, fetchTestimonials } from '../services/sanity.js';
import bgBanner from '../assets/img/bg-banner.png';

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, link, linkLabel = 'VIEW MORE', subtitle }) {
  return (
    <div className="flex items-end justify-between mb-6 border-b border-gray-200 pb-4">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors mb-1"
        >
          {linkLabel} <FiArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

// ── Flash Sale Countdown Timer ───────────────────────────────────────────────
function FlashSaleTimer() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 22 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="bg-black text-white font-black text-xl px-3 py-1 rounded-lg min-w-[3rem] text-center">
            {val}
          </span>
          {i < 2 && <span className="text-black font-black text-xl">:</span>}
        </span>
      ))}
    </div>
  );
}

// ── Brand Strip ──────────────────────────────────────────────────────────────
const BRANDS = ['PUMA', 'ADIDAS', 'REEBOK', 'LEVIS', 'H&M', 'ZARA', 'UNIQLO', 'GAP'];

function BrandStrip() {
  return (
    <div className="bg-black text-white overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...BRANDS, ...BRANDS].map((b, i) => (
          <span key={i} className="mx-8 text-xs font-black uppercase tracking-[0.4em] opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            {b}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 18s linear infinite; }
      `}</style>
    </div>
  );
}

// ── Trending Tags ────────────────────────────────────────────────────────────
const TAGS = [
  { label: 'Oversized Tees', link: '/shop?tag=oversized' },
  { label: 'Summer Vibes', link: '/shop?tag=summer' },
  { label: 'Monochrome', link: '/shop?tag=monochrome' },
  { label: 'Streetwear', link: '/shop?tag=street' },
  { label: 'Minimalist', link: '/shop?tag=minimal' },
  { label: 'Y2K Style', link: '/shop?tag=y2k' },
  { label: 'Vintage Wash', link: '/shop?tag=vintage' },
  { label: 'Cargos', link: '/shop?category=cargo' },
];

function TrendingTags() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-5">
        <FiTag size={16} className="text-gray-400" />
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Trending Now</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {TAGS.map((tag) => (
          <Link
            key={tag.label}
            to={tag.link}
            className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Style Editorial Block ────────────────────────────────────────────────────
function StyleEditorial() {
  const editorials = [
    {
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
      tag: 'Style Guide',
      title: 'How to style oversized fits this season',
      link: '/blog/oversized-fits',
    },
    {
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      tag: 'Trend Report',
      title: 'Monochrome looks for every day',
      link: '/blog/monochrome',
    },
    {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
      tag: 'Street Style',
      title: 'Dhaka streets inspire our new drop',
      link: '/blog/dhaka-street',
    },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Style Stories" subtitle="Editorial picks from our team" />
      <div className="grid gap-5 md:grid-cols-3">
        {editorials.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={item.link} className="group block overflow-hidden rounded-[2rem] bg-white">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-black text-gray-950 text-lg leading-snug group-hover:underline underline-offset-2">
                  {item.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-400 group-hover:text-black transition-colors">
                  Read more <FiArrowRight size={11} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Instagram Lookbook Grid ─────────────────────────────────────────────────
const LOOKBOOK_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
];

function LookbookGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiInstagram size={16} className="text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">@shopname</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">Lookbook</h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
        >
          Follow us <FiArrowRight size={12} />
        </a>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {LOOKBOOK_IMAGES.map((src, i) => (
          <motion.a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 block"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <img src={src} alt="look" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <FiInstagram size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
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
        const [cats, tests] = await Promise.all([fetchCategories(), fetchTestimonials()]);
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
      if (!localStorage.getItem('homePopupClosed')) setShowPopup(true);
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
  const flashSaleProducts = products.filter(p => p.discount || p.sale).slice(0, 4);

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
    <div className="bg-[#f6f5f1] text-gray-900">

      {/* ── HERO BANNER ── */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat flex items-center"
        style={{ backgroundImage: `url(${bgBanner})`, height: '855px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="relative z-10 w-full mx-auto max-w-[1400px] px-8 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 2, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col gap-5 max-w-xl"
          >
            <span className="inline-flex self-start rounded-full bg-yellow-400 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.35em] text-black">
              Trendy Collection
            </span>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.08]">
              Stylish looks<br />built for<br />everyday life.
            </h1>

            <p className="text-sm leading-6 text-gray-200 max-w-sm">
              Discover premium streetwear and essentials from Bangladesh's favorite fashion store. New drops, fast delivery, effortless styling.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-xs font-black uppercase tracking-[0.15em] text-black transition hover:bg-yellow-400"
              >
                Shop All
              </Link>
              <Link
                to="/shop?filter=new"
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-black"
              >
                New Arrivals
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-1">
              {[
                { icon: <FiTruck size={13} />, text: 'Free delivery ৳2000+' },
                { icon: <FiRefreshCw size={13} />, text: '7-day easy return' },
                { icon: <FiShield size={13} />, text: '100% authentic' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-white/85 text-xs font-semibold">
                  <span className="text-yellow-400">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <BrandStrip />

      {/* ── CATEGORY CARDS ── */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {catBanners.map((cat, index) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <Link to={cat.link} className="block h-full">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.src = `https://placehold.co/600x800/eeeeee/aaaaaa?text=${encodeURIComponent(cat.label)}`; }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">{cat.label}</p>
                  <p className="mt-2 text-xl font-black text-gray-950">Shop {cat.label}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRENDING TAGS ── */}
      <TrendingTags />

      {/* ── TOP SELLING ── */}
      {topSelling.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="Top Selling" link="/shop?filter=top" subtitle="Our customers' absolute favourites" />
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

      {/* ── FLASH SALE SECTION ── */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-black px-6 py-8 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 animate-pulse">
                <FiZap size={22} fill="currentColor" />
              </span>
              <div>
                <h2 className="text-2xl font-black uppercase text-white">Flash Sale</h2>
                <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Ends in</p>
              </div>
            </div>
            <FlashSaleTimer />
            <Link
              to="/shop?filter=sale"
              className="sm:ml-auto flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {flashSaleProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {flashSaleProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── EDITORIAL BANNER PAIR ── */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <Link to="/shop?gender=women" className="group relative overflow-hidden rounded-[2rem] bg-gray-950 min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80"
              alt="Women's wear"
              className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.35em] text-yellow-400">Women's Edit</span>
              <h2 className="mt-3 text-3xl font-black text-white">Fresh styles for her</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-300">New season pieces with elegant silhouettes and everyday comfort.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white group-hover:gap-3 transition-all">
                Shop Women <FiArrowRight size={13} />
              </span>
            </div>
          </Link>
          <Link to="/shop?category=hoodie" className="group relative overflow-hidden rounded-[2rem] bg-gray-950 min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80"
              alt="Hoodie collection"
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <span className="text-xs uppercase tracking-[0.35em] text-yellow-400">Limited Drop</span>
              <h2 className="mt-3 text-3xl font-black text-white">Cozy hoodies</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-300">Perfect layering for the season — easy to wear, easy to style.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white group-hover:gap-3 transition-all">
                Shop Hoodies <FiArrowRight size={13} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="New Arrivals" link="/shop?filter=new" subtitle="Just dropped — get them before they sell out" />
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

      {/* ── MEN'S PICKS ── */}
      {menProducts.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="Men's Picks" link="/shop?gender=men" subtitle="Top styles curated for him" />
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

      {/* ── WOMEN'S PICKS ── */}
      {womenProducts.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="Women's Picks" link="/shop?gender=women" subtitle="Top styles curated for her" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {womenProducts.map((product, i) => (
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

      {/* ── STYLE EDITORIAL ── */}
      <StyleEditorial />

      {/* ── PERKS STRIP ── */}
      <section className="border-t border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: <FiTruck size={20} />, title: 'Free Delivery', desc: 'On orders ৳ 2,000+' },
              { icon: <FiRefreshCw size={20} />, title: 'Easy Return', desc: '7-day return policy' },
              { icon: <FiShield size={20} />, title: '100% Authentic', desc: 'Verified products only' },
              { icon: <FiCreditCard size={20} />, title: 'Secure Pay', desc: 'Safe & fast checkout' },
            ].map((perk, index) => (
              <div key={index} className="rounded-[2rem] border border-gray-200 bg-[#f6f5f1] p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                  {perk.icon}
                </div>
                <p className="mt-5 text-base font-black text-gray-950">{perk.title}</p>
                <p className="mt-1.5 text-sm text-gray-500">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ── */}
      <LookbookGrid />

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <SectionHeader title="What customers say" subtitle="Real reviews from real people" />
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="rounded-[2rem] border border-gray-200 bg-white p-7"
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
                    <p className="font-black text-gray-950">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role || 'Verified customer'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section className="bg-black text-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">Stay in the loop</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Subscribe for exclusive offers
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Be the first to know about new arrivals, flash sales, and curated drops.
          </p>
          {subscribed ? (
            <p className="mt-8 inline-flex rounded-full bg-yellow-400 px-8 py-3 text-sm font-black uppercase tracking-[0.15em] text-black">
              ✓ You're subscribed!
            </p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="w-full rounded-full border border-gray-700 bg-gray-900 px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400 sm:max-w-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-yellow-300"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── POPUP ── */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-500">Special Offer</p>
              <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Summer Sale: Up to 30% Off</h2>
              <p className="mx-auto max-w-xs text-sm leading-6 text-gray-600">
                Limited-time prices on select fashion items. Tap below to shop trending styles now.
              </p>
              <Link
                to="/shop"
                onClick={closePopup}
                className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-gray-800"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
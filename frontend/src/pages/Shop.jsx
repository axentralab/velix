import { useState, useMemo } from 'react';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSliders, FiGrid, FiList, FiX } from 'react-icons/fi';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'New Arrival'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name A–Z', value: 'name_asc' },
];

export default function Shop() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [showFilters, setShowFilters] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;

  const filtered = useMemo(() => {
    let items = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || p.category === category;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchCat && matchPrice;
    });
    if (sort === 'price_asc') items = [...items].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items = [...items].sort((a, b) => b.price - a.price);
    else if (sort === 'name_asc') items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [search, category, sort, priceRange]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Shop</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">All fashion essentials</h1>
        <p className="mt-2 text-sm text-slate-500">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search + Controls */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <FiX size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-slate-400 transition">
            <FiSliders size={15} /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex rounded-full border border-slate-200 bg-white overflow-hidden">
            <button onClick={() => setView('grid')}
              className={`px-4 py-3 text-sm transition ${view === 'grid' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <FiGrid size={15} />
            </button>
            <button onClick={() => setView('list')}
              className={`px-4 py-3 text-sm transition ${view === 'list' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <FiList size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-semibold text-slate-900">Price Range</p>
                <div className="space-y-2">
                  <input type="range" min={0} max={500} step={10} value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-slate-950" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>$0</span><span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-4 text-sm font-semibold text-slate-900">Quick reset</p>
                <button onClick={() => { setSearch(''); setCategory('All'); setSort('newest'); setPriceRange([0, 500]); }}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm text-slate-600 hover:border-slate-400 transition">
                  Clear all filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${category === cat
              ? 'bg-slate-950 text-white shadow-md'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid/List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-500">
          No products match your filters.
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }} whileHover={{ y: -4 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((product, i) => (
            <motion.a key={product.id} href={`/product/${product.id}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition items-center">
              <img src={product.image || 'https://via.placeholder.com/150x150?text=No+Image'} alt={product.name} className="h-24 w-24 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs uppercase tracking-widest text-slate-400">{product.category}</span>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>
              </div>
              <p className="text-xl font-bold text-slate-950">${product.price}</p>
            </motion.a>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 rounded-[2rem] bg-slate-950 p-10 text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Can't decide?</p>
        <h2 className="mt-3 text-3xl font-bold">Let us style you.</h2>
        <p className="mt-3 text-slate-400 max-w-md mx-auto text-sm">
          Book a free personal styling session and let our experts curate the perfect looks for your lifestyle.
        </p>
        <a href="/contact" className="mt-6 inline-flex rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 hover:bg-yellow-400 transition">
          Book a session
        </a>
      </div>
    </div>
  );
}

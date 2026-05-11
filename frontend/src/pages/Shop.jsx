import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch, FiX, FiShoppingBag, FiHeart, FiChevronDown,
  FiChevronRight, FiGrid, FiSliders, FiZap, FiTruck, FiStar,
} from 'react-icons/fi';
import { useProducts } from '../contexts/ProductContext.jsx';
import { fetchShopCategoryTree } from '../services/sanity.js';
import Loader from '../components/common/Loader.jsx';

// ── Static Special Offers (icons stay static, filter logic uses product flags) ──
const SPECIAL_OFFERS = [
  { icon: '⚡', label: 'Mega Deal', filter: 'onSale' },
  { icon: '✨', label: 'New Arrival', filter: 'newArrival' },
  { icon: '🔥', label: 'Top Selling', filter: 'topSelling' },
  { icon: '🚚', label: 'Free Delivery', filter: 'freeDelivery' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name A–Z', value: 'name_asc' },
];

// Fallback category tree in case Sanity returns empty
const FALLBACK_CATEGORY_TREE = [
  {
    name: 'Men', slug: 'men', gender: 'men',
    children: ['T-Shirt', 'Polo T-Shirt', 'Hoodie', 'Sweatshirt', 'Jacket', 'Cargo Pants', 'Joggers', 'Shorts'],
  },
  {
    name: 'Women', slug: 'women', gender: 'women',
    children: ['Kurti & Tops', 'T-Shirt Women', 'Co-ords Set', 'Leggings', 'Palazzo', 'Comfy Trouser', 'Hijab', 'Bag'],
  },
  {
    name: 'Kids', slug: 'kids', gender: 'kids',
    children: ['Boys T-Shirt', 'Girls Frock', 'Boys Shorts', 'Girls Shorts', 'Panjabi', 'Hoodie Kids'],
  },
  {
    name: 'Hoodie', slug: 'hoodie', gender: null,
    children: ['Oversized Hoodie', 'Zip-Up Hoodie', 'Pullover Hoodie', 'Couple Hoodie', 'Graphic Hoodie'],
  },
  {
    name: 'Shoes', slug: 'shoes', gender: null,
    children: ['Sneakers', 'Loafers', 'Formal Shoes', 'Sports Shoes', 'Sandals', 'Heels', 'Flats'],
  },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ShopProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const savings = product.originalPrice ? product.originalPrice - product.price : null;

  const imageSrc = product.image
    || `https://placehold.co/400x500/f8fafc/94a3b8?text=${encodeURIComponent(product.name || 'Product')}`;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <Link to={`/product/${product.slug || product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={imageSrc}
          alt={product.name}
          onError={(e) => { e.target.src = `https://placehold.co/400x500/f8fafc/94a3b8?text=Velix`; }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges top-left */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount && discount > 0 && (
            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.newArrival && (
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
              NEW
            </span>
          )}
          {product.topSelling && (
            <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
              🔥 HOT
            </span>
          )}
          {product.freeDelivery && (
            <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
              FREE DEL
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
          >
            <FiHeart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        {/* Subcategory or Category */}
        <p className="text-[10px] uppercase tracking-widest text-gray-400">
          {product.subcategory || product.category}
        </p>

        {/* Name */}
        <Link
          to={`/product/${product.slug || product.id}`}
          className="mt-0.5 block text-sm font-semibold text-gray-900 hover:text-black line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        {/* Save badge */}
        {savings && savings > 0 && (
          <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            💰 Save ৳{savings.toLocaleString()}
          </div>
        )}

        {/* Price row + Add to Cart */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">
                ৳{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow hover:bg-gray-800 transition hover:scale-110"
            onClick={(e) => e.preventDefault()}
            aria-label="Add to cart"
          >
            <FiShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Shop Page ─────────────────────────────────────────────────────────────
export default function Shop() {
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();

  // Category tree from Sanity
  const [categoryTree, setCategoryTree] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeGender, setActiveGender] = useState(null);
  const [expandedCats, setExpandedCats] = useState({});
  const [specialFilter, setSpecialFilter] = useState(null);
  const [sort, setSort] = useState('newest');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16);

  // Fetch category tree from Sanity
  useEffect(() => {
    let active = true;
    setCatLoading(true);
    fetchShopCategoryTree()
      .then((tree) => {
        if (!active) return;
        if (tree && tree.length > 0) {
          setCategoryTree(tree);
          // Auto-expand first category
          setExpandedCats({ [tree[0].name]: true });
        } else {
          // Use fallback if Sanity returns empty
          setCategoryTree(FALLBACK_CATEGORY_TREE);
          setExpandedCats({ Men: true });
        }
      })
      .catch(() => {
        if (!active) return;
        setCategoryTree(FALLBACK_CATEGORY_TREE);
        setExpandedCats({ Men: true });
      })
      .finally(() => {
        if (active) setCatLoading(false);
      });
    return () => { active = false; };
  }, []);

  const toggleCat = (name) =>
    setExpandedCats((prev) => ({ ...prev, [name]: !prev[name] }));

  // Filter logic — useMemo MUST be before any early return
  const filtered = useMemo(() => {
    if (loading || !products.length) return [];
    let items = [...products];

    if (search) items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    if (activeGender) {
      items = items.filter((p) => p.gender === activeGender || p.gender === 'unisex');
    }

    if (activeCategory) {
      const isParent = categoryTree.some(c => c.slug === activeCategory);
      if (isParent) {
        // Parent category — filter by categorySlug
        items = items.filter((p) => p.categorySlug === activeCategory);
      } else {
        // Child subcategory — filter by subcategory field first, then name fallback
        items = items.filter((p) =>
          p.subcategory?.toLowerCase() === activeCategory.toLowerCase() ||
          p.subcategory?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          p.category?.toLowerCase().includes(activeCategory.toLowerCase())
        );
      }
    }

    // Special offer filters
    if (specialFilter === 'onSale') items = items.filter((p) => p.onSale || p.originalPrice);
    if (specialFilter === 'newArrival') items = items.filter((p) => p.newArrival);
    if (specialFilter === 'topSelling') items = items.filter((p) => p.topSelling);
    if (specialFilter === 'freeDelivery') items = items.filter((p) => p.freeDelivery);

    if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'name_asc') items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [products, search, activeGender, activeCategory, specialFilter, sort, loading, categoryTree]);

  // Early returns AFTER all hooks
  if (loading) return <Loader />;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  const clearFilters = () => {
    setSearch('');
    setActiveCategory(null);
    setActiveGender(null);
    setSpecialFilter(null);
    setSort('newest');
    setVisibleCount(16);
  };

  const hasActiveFilter = search || activeCategory || activeGender || specialFilter;
  const visible = filtered.slice(0, visibleCount);

  // ── Sidebar Content ──────────────────────────────────────────────────────────
  const renderSidebar = () => (
    <div className="space-y-6">
      {/* Special Offers */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Special Offers</h3>
        <ul className="space-y-1.5">
          {SPECIAL_OFFERS.map((offer) => (
            <li key={offer.filter}>
              <button
                onClick={() => setSpecialFilter(specialFilter === offer.filter ? null : offer.filter)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${specialFilter === offer.filter
                  ? 'bg-black text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span>{offer.icon}</span>
                {offer.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-100" />

      {/* Category Tree — from Sanity */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Categories</h3>

        {catLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {categoryTree.map((cat) => (
              <li key={cat.slug}>
                {/* Parent */}
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setActiveCategory(activeCategory === cat.slug ? null : cat.slug);
                      setActiveGender(null);
                      setVisibleCount(16);
                    }}
                    className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${activeCategory === cat.slug
                      ? 'bg-black text-white'
                      : 'text-gray-800 hover:bg-gray-50'
                      }`}
                  >
                    {cat.name}
                  </button>
                  {cat.children && cat.children.length > 0 && (
                    <button
                      onClick={() => toggleCat(cat.name)}
                      className="p-2 text-gray-400 hover:text-gray-700"
                    >
                      <FiChevronDown
                        size={14}
                        className={`transition-transform ${expandedCats[cat.name] ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* Children */}
                {expandedCats[cat.name] && cat.children && cat.children.length > 0 && (
                  <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
                    {cat.children.map((child) => (
                      <li key={child}>
                        <button
                          onClick={() => {
                            setActiveCategory(activeCategory === child ? null : child);
                            setVisibleCount(16);
                          }}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition ${activeCategory === child
                            ? 'font-semibold text-black'
                            : 'text-gray-500 hover:text-black'
                            }`}
                        >
                          <span>{child}</span>
                          <FiChevronRight size={11} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Gender Tabs */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Gender</h3>
        <div className="flex flex-wrap gap-2">
          {['men', 'women', 'kids', 'unisex'].map((g) => (
            <button
              key={g}
              onClick={() => setActiveGender(activeGender === g ? null : g)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${activeGender === g
                ? 'bg-black text-white'
                : 'border border-gray-200 text-gray-600 hover:border-black'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilter && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link>
          <FiChevronRight size={10} />
          <span className="font-medium text-black">Shop</span>
          {activeCategory && (
            <>
              <FiChevronRight size={10} />
              <span className="font-medium text-black capitalize">
                {categoryTree.find(c => c.slug === activeCategory)?.name || activeCategory}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-0">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden w-56 flex-shrink-0 border-r border-gray-200 bg-white p-4 lg:block sticky top-[120px] self-start max-h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
            <FiSliders size={14} /> Refine Set
          </h2>
          {renderSidebar()}
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-4 lg:p-6">

          {/* Top Bar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(16); }}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-black"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Mobile filter btn */}
            <button
              onClick={() => setMobileSidebar(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium lg:hidden"
            >
              <FiSliders size={14} /> Filter
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Count */}
            <p className="text-sm text-gray-500 hidden md:block">
              <span className="font-semibold text-black">{filtered.length}</span> Products
            </p>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilter && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeCategory && (
                <span className="flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs text-white">
                  {categoryTree.find(c => c.slug === activeCategory)?.name || activeCategory}
                  <button onClick={() => setActiveCategory(null)}><FiX size={11} /></button>
                </span>
              )}
              {activeGender && (
                <span className="flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs text-white capitalize">
                  {activeGender}
                  <button onClick={() => setActiveGender(null)}><FiX size={11} /></button>
                </span>
              )}
              {specialFilter && (
                <span className="flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs text-white">
                  {SPECIAL_OFFERS.find(o => o.filter === specialFilter)?.label}
                  <button onClick={() => setSpecialFilter(null)}><FiX size={11} /></button>
                </span>
              )}
              {search && (
                <span className="flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs text-white">
                  "{search}"
                  <button onClick={() => setSearch('')}><FiX size={11} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-gray-400 underline hover:text-black">
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
              <FiSearch size={32} className="mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-500">No products found</p>
              <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm text-white hover:bg-gray-800">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {visible.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35 }}
                  >
                    <ShopProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {visibleCount < filtered.length && (
                <div className="mt-10 text-center">
                  <p className="mb-3 text-xs text-gray-400">
                    Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products
                  </p>
                  <button
                    onClick={() => setVisibleCount((v) => v + 16)}
                    className="rounded-full border-2 border-black px-10 py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
          <div className="relative ml-auto h-full w-72 overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">Filter Products</h2>
              <button onClick={() => setMobileSidebar(false)}><FiX size={20} /></button>
            </div>
            {renderSidebar()}
          </div>
        </div>
      )}
    </div>
  );
}

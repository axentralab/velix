import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addItem } from '../redux/slices/cartSlice.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';
import { motion } from 'framer-motion';
import {
  FiHeart, FiShare2, FiTruck, FiRefreshCw, FiShield,
  FiStar, FiChevronDown, FiChevronUp, FiCheckCircle,
} from 'react-icons/fi';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useProducts();

  // ── All hooks MUST be before any conditional return ──────────────────────
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [expandedDetail, setExpandedDetail] = useState(null);

  // Match by slug first (URL uses slug), then fall back to _id
  const product = products.find((item) => item.slug === id || item.id === id);
  const related = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  // ── Early returns AFTER all hooks ───────────────────────────────────────
  if (loading) return <Loader />;
  if (error) return (
    <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>
  );
  if (!product) return (
    <div className="mx-auto max-w-6xl px-6 py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Product not found</h2>
      <p className="text-slate-400 mb-6">This product may have been removed or the URL is incorrect.</p>
      <Link to="/shop" className="inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition">
        Back to Shop
      </Link>
    </div>
  );

  // ── Derived data from Sanity product ────────────────────────────────────
  const fallbackImage = `https://placehold.co/900x560/f8fafc/94a3b8?text=${encodeURIComponent(product.name)}`;
  const allImages = [
    product.image || fallbackImage,
    ...(product.images || []),
  ].filter(Boolean);
  const images = allImages.length > 0 ? allImages : [fallbackImage];

  const sizes = product.sizes?.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];
  const colors = product.colors?.length > 0 ? product.colors : [];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const currentSize = selectedSize || sizes[0];
  const currentColor = selectedColor || (colors[0]?.hex || null);

  const handleAddToCart = () => {
    dispatch(addItem({
      ...product,
      quantity,
      selectedSize: currentSize,
      selectedColor: currentColor,
    }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const details = [
    {
      title: 'Material & Care',
      content: '100% premium quality fabric. Machine wash cold. Do not bleach. Tumble dry low. Iron at medium heat.',
    },
    {
      title: 'Shipping & Returns',
      content: 'Free delivery on orders over ৳2000. Returns accepted within 7 days of delivery in original condition.',
    },
    {
      title: 'Size & Fit',
      content: 'Fits true to size. If between sizes, we recommend sizing up. Check our size guide for detailed measurements.',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-12">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-slate-700">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              to={`/shop?category=${product.categorySlug}`}
              className="hover:text-slate-700 capitalize"
            >
              {product.category}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-[180px]">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

        {/* ── Images Column ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm relative">
            {/* Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
              {discount && discount > 0 && (
                <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                  -{discount}%
                </span>
              )}
              {product.newArrival && (
                <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow">NEW</span>
              )}
              {product.topSelling && (
                <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow">🔥 HOT</span>
              )}
              {product.freeDelivery && (
                <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white shadow">🚚 Free</span>
              )}
            </div>
            <motion.img
              key={activeImage}
              src={images[activeImage]}
              alt={product.name}
              onError={(e) => { e.target.src = fallbackImage; }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-h-[560px] object-cover lg:h-[560px]"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border-2 transition ${activeImage === i
                    ? 'border-slate-950 shadow'
                    : 'border-transparent hover:border-slate-300'}`}
                >
                  <img
                    src={src}
                    alt={`view-${i}`}
                    onError={(e) => { e.target.src = fallbackImage; }}
                    className="h-24 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info Panel ── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

            {/* Category badge + Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-500">
                  {product.subcategory || product.category}
                </span>
                {product.gender && (
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-widest text-slate-400 capitalize">
                    {product.gender}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-950 leading-tight lg:text-3xl">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-slate-400">(128 reviews)</span>
                {product.stock > 0 ? (
                  <span className="ml-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <FiCheckCircle size={12} /> In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="ml-2 text-xs font-medium text-red-500">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <p className="text-3xl font-bold text-slate-950">৳{product.price?.toLocaleString()}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <p className="text-sm text-slate-400 line-through">৳{product.originalPrice?.toLocaleString()}</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Colors — from Sanity */}
            {colors.length > 0 && (
              <div>
                <p className="mb-2.5 text-sm font-semibold text-slate-700">
                  Color: <span className="font-normal text-slate-500">
                    {colors.find(c => c.hex === currentColor)?.name || colors[0]?.name}
                  </span>
                </p>
                <div className="flex gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.hex || c.name}
                      onClick={() => setSelectedColor(c.hex)}
                      title={c.name}
                      style={{ backgroundColor: c.hex || '#ccc' }}
                      className={`h-8 w-8 rounded-full ring-offset-2 transition shadow-sm ${currentColor === c.hex
                        ? 'ring-2 ring-slate-950'
                        : 'hover:ring-2 hover:ring-slate-400'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes — from Sanity */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Size: <span className="font-normal text-slate-500">{currentSize}</span></p>
                <button className="text-xs text-slate-400 underline underline-offset-2 hover:text-slate-700">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[2.5rem] rounded-full border px-3 py-2 text-sm font-medium transition ${currentSize === s
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="mb-2.5 text-sm font-semibold text-slate-700">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-400 transition text-lg font-bold"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-slate-900 text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-400 transition text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 rounded-full py-4 text-sm font-semibold uppercase tracking-[0.1em] transition ${addedToCart
                  ? 'bg-emerald-500 text-white'
                  : product.stock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-950 text-white hover:bg-slate-800'}`}
              >
                {addedToCart ? '✓ Added to cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setWishlist(!wishlist)}
                className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${wishlist
                  ? 'border-rose-400 bg-rose-50 text-rose-500'
                  : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
              >
                <FiHeart size={18} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
              <button className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 transition">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { icon: <FiTruck size={14} />, label: product.freeDelivery ? 'Free Delivery' : 'Fast Delivery' },
                { icon: <FiRefreshCw size={14} />, label: '7-day return' },
                { icon: <FiShield size={14} />, label: '100% Authentic' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 py-3 text-xs text-slate-500">
                  <span className="text-slate-700">{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Details */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {details.map((d, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => setExpandedDetail(expandedDetail === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold text-slate-900"
                >
                  {d.title}
                  {expandedDetail === i
                    ? <FiChevronUp size={15} className="text-slate-400" />
                    : <FiChevronDown size={15} className="text-slate-400" />
                  }
                </button>
                {expandedDetail === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden px-6 pb-4 text-sm text-slate-500 leading-7"
                  >
                    {d.content}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Description / Reviews Tabs ── */}
      <div className="mt-14">
        <div className="flex gap-1 border-b border-slate-200 mb-8">
          {['description', 'reviews', 'shipping'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${activeTab === tab
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="max-w-2xl space-y-4 text-sm leading-8 text-slate-600">
            <p>{product.description || 'No description available.'}</p>
            <ul className="space-y-2 list-disc list-inside text-slate-500">
              <li>Premium quality construction</li>
              <li>Responsibly sourced materials</li>
              <li>Signature Velix finish</li>
              {product.sizes?.length > 0 && <li>Available in sizes: {product.sizes.join(', ')}</li>}
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-2xl">
            {[
              { name: 'Alex T.', rating: 5, text: 'Perfect fit and absolutely stunning quality. Worth every penny.' },
              { name: 'Maria K.', rating: 4, text: 'Beautiful piece, ships fast. The fabric feels incredibly premium.' },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex gap-0.5 text-amber-400 mb-2">
                  {[...Array(r.rating)].map((_, j) => <FiStar key={j} size={13} fill="currentColor" />)}
                </div>
                <p className="text-sm text-slate-600">"{r.text}"</p>
                <p className="mt-3 text-xs font-semibold text-slate-900">{r.name}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 space-y-3">
            <p><strong className="text-slate-900">Standard Delivery:</strong> 3–5 business days</p>
            <p><strong className="text-slate-900">Express Delivery:</strong> 1–2 business days</p>
            <p><strong className="text-slate-900">Free Delivery:</strong> On orders above ৳2,000</p>
            <p><strong className="text-slate-900">Return Policy:</strong> 7 days easy return in original condition</p>
          </div>
        )}
      </div>

      {/* ── Related Products ── */}
      {(related.length > 0 || products.length > 0) && (
        <div className="mt-16">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">More like this</p>
          <h2 className="mt-2 mb-8 text-2xl font-bold text-slate-950">You may also like</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
            {(related.length > 0
              ? related
              : products.filter(p => p.id !== product.id).slice(0, 4)
            ).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/product/${p.slug || p.id}`}
                  className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={p.image || `https://placehold.co/400x500/f8fafc/94a3b8?text=${encodeURIComponent(p.name)}`}
                      alt={p.name}
                      onError={(e) => { e.target.src = `https://placehold.co/400x500/f8fafc/94a3b8?text=Velix`; }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">{p.subcategory || p.category}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">৳{p.price?.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">৳{p.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

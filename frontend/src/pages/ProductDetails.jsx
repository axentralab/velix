import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addItem } from '../redux/slices/cartSlice.js';
import Button from '../components/common/Button.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['#1e293b', '#c2a63a', '#8b5cf6', '#e11d48', '#64748b'];

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useProducts();
  const product = products.find((item) => item.id === id);
  const related = product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;
  if (!product) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-slate-500">Product not found.</div>;

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [expandedDetail, setExpandedDetail] = useState(null);

  const fallbackImage = 'https://via.placeholder.com/900x560?text=No+Image+Available';
  const images = [product.image || fallbackImage];

  const handleAddToCart = () => {
    dispatch(addItem({ ...product, quantity, selectedSize, selectedColor }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const details = [
    { title: 'Material & Care', content: '100% premium quality fabric. Dry clean recommended. Do not bleach. Iron at medium heat.' },
    { title: 'Shipping & Returns', content: 'Free worldwide shipping on orders over $150. Returns accepted within 14 days of delivery.' },
    { title: 'Size & Fit', content: 'Model is 6\'1" and wears size M. Fits true to size. Refer to our size guide for detailed measurements.' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-slate-700">Shop</Link>
        <span>/</span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <motion.img key={activeImage} src={images[activeImage]} alt={product.name}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              className="h-[560px] w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {images.map((src, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`overflow-hidden rounded-2xl border-2 transition ${activeImage === i ? 'border-slate-950' : 'border-transparent'}`}>
                <img src={src} alt={`view-${i}`} className="h-32 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm space-y-6">
            {/* Category + Title */}
            <div>
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-widest text-slate-500">
                {product.category}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-0.5 text-gold">
                  {[...Array(5)].map((_, i) => <FiStar key={i} size={13} fill="currentColor" />)}
                </div>
                <span className="text-xs text-slate-400">(128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-semibold text-slate-950">${product.price}</p>
              <p className="text-sm text-slate-400 line-through">${Math.round(product.price * 1.3)}</p>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">Save 23%</span>
            </div>

            {/* Colors */}
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Color</p>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-8 w-8 rounded-full ring-offset-2 transition ${selectedColor === c ? 'ring-2 ring-slate-950' : ''}`} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Size</p>
                <button className="text-xs text-slate-400 underline underline-offset-2 hover:text-slate-700">Size guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`h-10 min-w-[2.5rem] rounded-full border px-3 text-sm font-medium transition ${selectedSize === s
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-400 transition text-lg">−</button>
                <span className="w-8 text-center font-semibold text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:border-slate-400 transition text-lg">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart}
                className={`flex-1 rounded-full py-4 text-sm font-semibold uppercase tracking-[0.15em] transition ${addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-950 text-white hover:bg-slate-800'}`}>
                {addedToCart ? '✓ Added to cart' : 'Add to cart'}
              </button>
              <button onClick={() => setWishlist(!wishlist)}
                className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${wishlist
                  ? 'border-rose-400 bg-rose-50 text-rose-500'
                  : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                <FiHeart size={18} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
              <button className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 transition">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <FiTruck size={14} />, label: 'Free shipping' },
                { icon: <FiRefreshCw size={14} />, label: '14-day return' },
                { icon: <FiShield size={14} />, label: 'Authentic' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-50 py-3 text-xs text-slate-500">
                  <span className="text-slate-700">{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Details */}
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            {details.map((d, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button onClick={() => setExpandedDetail(expandedDetail === i ? null : i)}
                  className="flex w-full items-center justify-between px-8 py-5 text-left text-sm font-semibold text-slate-900">
                  {d.title}
                  {expandedDetail === i ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </button>
                {expandedDetail === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden px-8 pb-5 text-sm text-slate-500 leading-7">
                    {d.content}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description / Reviews Tabs */}
      <div className="mt-16">
        <div className="flex gap-1 border-b border-slate-200 mb-8">
          {['description', 'reviews', 'shipping'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${activeTab === tab
                ? 'border-slate-950 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'description' && (
          <div className="max-w-2xl space-y-4 text-sm leading-8 text-slate-600">
            <p>{product.description}</p>
            <p>
              Designed for those who appreciate the finest details, this piece combines luxury with everyday wearability.
              Crafted by skilled artisans using premium materials sourced responsibly from certified suppliers.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Premium quality construction</li>
              <li>Limited edition release</li>
              <li>Responsibly sourced materials</li>
              <li>Signature Velix finish</li>
            </ul>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-2xl">
            {[
              { name: 'Alex T.', rating: 5, text: 'Perfect fit and absolutely stunning quality. Worth every penny.' },
              { name: 'Maria K.', rating: 4, text: 'Beautiful piece, ships fast. The fabric feels incredibly premium.' },
            ].map((r, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex gap-1 text-gold mb-2">
                  {[...Array(r.rating)].map((_, j) => <FiStar key={j} size={13} fill="currentColor" />)}
                </div>
                <p className="text-sm text-slate-600">"{r.text}"</p>
                <p className="mt-3 text-xs font-semibold text-slate-900">{r.name}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'shipping' && (
          <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 space-y-4">
            <p><strong className="text-slate-900">Standard Shipping:</strong> 5–7 business days — Free on orders over $150</p>
            <p><strong className="text-slate-900">Express Shipping:</strong> 2–3 business days — $19.99</p>
            <p><strong className="text-slate-900">Overnight Shipping:</strong> Next business day — $39.99</p>
            <p><strong className="text-slate-900">International:</strong> 10–14 business days — from $29.99</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">More like this</p>
          <h2 className="mt-3 mb-8 text-3xl font-bold text-slate-950">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.concat(products.slice(0, Math.max(0, 4 - related.length))).slice(0, 4).map((p, i) => (
              <motion.div key={p.id} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice.js';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const imageSrc = product.image
    ? product.image
    : `https://placehold.co/500x640/f5f5f5/aaaaaa?text=${encodeURIComponent(product.name || 'Product')}`;

  const productLink = `/product/${product.slug || product.id}`;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <article className="group min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/40">
      <Link to={productLink} className="block">
        <div className="relative aspect-[3/4] min-w-0 overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://placehold.co/500x640/f5f5f5/aaaaaa?text=Veloura';
            }}
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.newArrival && (
              <span className="rounded-md bg-slate-950 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                New
              </span>
            )}
            {discount && (
              <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                -{discount}%
              </span>
            )}
            {product.topSelling && (
              <span className="rounded-md bg-lime-300 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">
                Hot
              </span>
            )}
          </div>

          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-950 hover:text-white"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={isInWishlist ? 'fill-red-500 text-red-500' : ''} size={17} />
          </button>

          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">
              <FiShoppingBag size={14} />
              View Details
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {product.subcategory || product.category || 'Veloura'}
          </p>
          <p className="mt-2 min-h-[2.5rem] text-sm font-bold leading-5 text-slate-950 line-clamp-2">
            {product.name}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-black text-slate-950">৳{product.price?.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-semibold text-slate-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

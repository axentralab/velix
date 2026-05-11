import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const imageSrc = product.image
    ? product.image
    : `https://placehold.co/500x640/f5f5f5/aaaaaa?text=${encodeURIComponent(product.name || 'Product')}`;

  const productLink = `/product/${product.slug || product.id}`;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article className="group relative cursor-pointer min-w-0">
      <Link to={productLink} className="block">
        {/* Image Container — Fabrilife style: square image, no border-radius, flat */}
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] min-w-0">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = `https://placehold.co/500x640/f5f5f5/aaaaaa?text=Velix`;
            }}
          />

          {/* Badges — top left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.newArrival && (
              <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                NEW
              </span>
            )}
            {discount && (
              <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                -{discount}%
              </span>
            )}
            {product.topSelling && (
              <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                HOT
              </span>
            )}
          </div>

          {/* Floating price tag — Fabrilife signature */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 shadow-md text-center min-w-[110px]">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold text-gray-900">৳{product.price?.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-gray-400 line-through">৳{product.originalPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* VIEW MORE hover overlay — Fabrilife style */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white text-black text-xs font-bold uppercase tracking-[0.2em] px-5 py-2.5">
              View Details
            </span>
          </div>
        </div>

        {/* Product name below image */}
        <div className="mt-2.5 px-0.5">
          <p className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </p>
          {product.subcategory && (
            <p className="mt-0.5 text-[11px] text-gray-400 uppercase tracking-wider">{product.subcategory}</p>
          )}
        </div>
      </Link>
    </article>
  );
}

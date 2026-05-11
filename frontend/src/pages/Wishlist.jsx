import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';

export default function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Wishlist</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Your saved favorites</h1>
        <p className="mt-2 text-slate-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex rounded-3xl border border-slate-200 bg-slate-50 px-8 py-6 text-slate-950 mb-6">
            <span className="text-sm uppercase tracking-[0.3em]">Empty wishlist</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-950 mb-4">No favorites yet</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Start exploring our collection and save items you love to your wishlist.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

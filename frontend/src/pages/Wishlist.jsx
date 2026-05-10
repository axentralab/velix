import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';

export default function Wishlist() {
  const { products, loading, error } = useProducts();

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;

  const favorites = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Wishlist</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Your saved favorites</h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

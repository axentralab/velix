import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { useProducts } from '../contexts/ProductContext.jsx';

export default function Category() {
  const { slug } = useParams();
  const { products, loading, error } = useProducts();

  if (loading) return <Loader />;
  if (error) return <div className="mx-auto max-w-6xl px-6 py-20 text-center text-red-500">{error}</div>;

  const filtered = products.filter((product) => product.category.toLowerCase() === slug.toLowerCase());

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Category</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">{slug || 'All'} Collection</h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {(filtered.length ? filtered : products).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

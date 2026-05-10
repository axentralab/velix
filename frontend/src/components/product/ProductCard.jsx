import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const imageSrc = product.image || 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <img src={imageSrc} alt={product.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{product.category}</span>
          <span className="text-sm font-semibold text-slate-950">${product.price}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block text-lg font-semibold text-slate-950 hover:text-gold">
          {product.name}
        </Link>
      </div>
    </motion.article>
  );
}

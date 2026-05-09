import { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts } from '../services/sanity.js';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (active) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load products from Sanity');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used inside ProductProvider');
  }
  return context;
}

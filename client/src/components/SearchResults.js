
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axios';
import ProductCard from './ProductCard';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const SearchResults = () => {
  const query = useQuery();
  const q = query.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSearch = async () => {
      const term = q.trim();
      if (!term) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `/products/search?q=${encodeURIComponent(term)}`
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error('Search error:', err?.response?.data || err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [q]);

  const trimmed = q.trim();
  const titleText = trimmed
    ? `Search results for "${trimmed}"`
    : 'Search products';

  return (
    <div className="product-section">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 16,
          marginBottom: 12
        }}
      >
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          {titleText}
        </h2>

        {trimmed && !loading && (
          <span className="muted-text" style={{ fontSize: 13 }}>
            {products.length} result{products.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {loading ? (
        <p className="muted-text">Searching products...</p>
      ) : !trimmed ? (
        <p className="muted-text">
          Type a product name (for example, <strong>Chino Pants</strong>) in
          the search bar above and press Enter.
        </p>
      ) : products.length === 0 ? (
        <p className="muted-text">
          No products found matching <strong>{trimmed}</strong>. Try a
          different keyword.
        </p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

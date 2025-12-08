
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import ProductCard from './ProductCard';

const ProductList = ({ title = 'Featured Products', categorySlug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterBySlug = (product) => {
    if (!categorySlug || categorySlug === 'all') return true;

   
    const cat = ((product.category || '') + '').toLowerCase();
    const name = ((product.name || '') + '').toLowerCase();

    
    const isMenCategory = /\bmen\b/.test(cat);
    const isWomenCategory = /\bwomen\b/.test(cat);

    if (categorySlug === 'men') {
    
      return isMenCategory && !isWomenCategory;
    }

    if (categorySlug === 'women') {
    
      return isWomenCategory && !isMenCategory;
    }

    if (categorySlug === 'footwear') {
      return (
        cat.includes('footwear') ||
        name.includes('sneaker') ||
        name.includes('shoe') ||
        name.includes('trainer')
      );
    }

    if (categorySlug === 'accessories') {
      return (
        cat.includes('accessor') ||
        name.includes('cap') ||
        name.includes('hat') ||
        name.includes('belt') ||
        name.includes('bag')
      );
    }

    if (categorySlug === 'winter') {
      return (
        cat.includes('outerwear') ||
        name.includes('jacket') ||
        name.includes('coat') ||
        name.includes('sweater') ||
        name.includes('hoodie')
      );
    }

    if (categorySlug === 'essentials') {
      return (
        name.includes('t-shirt') ||
        name.includes('t shirt') ||
        name.includes('tee') ||
        name.includes('jeans') ||
        name.includes('blouse')
      );
    }

    if (categorySlug === 'new-in') {
      
      return true;
    }

    
    return true;
  };

  const visibleProducts = products.filter(filterBySlug);

  return (
    <section className="product-section">
      <div className="product-section-header">
        <h2 className="section-title">{title}</h2>
      </div>

      {loading ? (
        <p className="muted-text">Loading products...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="muted-text">No products available for this category.</p>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;

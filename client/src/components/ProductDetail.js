import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import { useCart } from '../context/CartContext';
import ProductReviews from './ProductReviews';

const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/products/${productId}`);
        setProduct(res.data);

        
        const aiRes = await axios.post('/ai/recommendations', { productId });
        setRecommended(aiRes.data.recommendedProducts || []);
      } catch (err) {
        console.error('Error loading product:', err);
      }
    };
    load();
  }, [productId]);

  if (!product) {
    return (
      <div className="product-section">
        <p className="muted-text">Loading product...</p>
      </div>
    );
  }

  return (
    <>
      <div className="product-section">
        <h2 className="section-title">{product.name}</h2>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ maxWidth: '320px' }}>
            <img src={product.imageUrl} alt={product.name} className="product-card-image" />
          </div>
          <div>
            <p className="product-card-category">{product.category}</p>
            <p className="product-card-price" style={{ fontSize: 24 }}>
              ${product.price.toFixed(2)}
            </p>
            <p style={{ marginTop: '12px' }}>{product.description}</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '12px' }}
              onClick={() => addToCart(product)}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

     
      <ProductReviews productId={product._id} />

     
      {recommended.length > 0 && (
        <section className="product-section">
          <h2 className="section-title">AI Recommended for You</h2>
          <div className="product-grid">
            {recommended.map((r) => (
              <div key={r._id} className="product-card">
                <img src={r.imageUrl} alt={r.name} className="product-card-image" />
                <h3 className="product-card-title">{r.name}</h3>
                <p className="product-card-price">${r.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetail;

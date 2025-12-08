
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault(); 
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="product-card-image-wrapper">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card-image"
          />
        </div>
        <div className="product-card-body">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-category">{product.category}</p>
          <p className="product-card-price">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button className="btn btn-primary product-card-button" onClick={handleAdd}>
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;

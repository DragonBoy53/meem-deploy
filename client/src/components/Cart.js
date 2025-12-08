
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems = [],
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  const handleQuantityChange = (productId, value) => {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      return;
    }
    updateQuantity(productId, num);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="product-section">
        <h2 className="section-title">Your Cart</h2>
        <p className="muted-text">Your cart is currently empty.</p>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="product-section">
      <h2 className="section-title">Your Cart</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: 24,
          alignItems: 'flex-start'
        }}
      >
        
        <div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {cartItems.map((item) => (
              <li
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #e5e7eb',
                  gap: 12
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flex: 1
                  }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 6
                      }}
                    />
                  )}

                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div
                      className="muted-text"
                      style={{ fontSize: 13, marginTop: 2 }}
                    >
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, e.target.value)
                    }
                    style={{
                      width: 60,
                      padding: '4px 6px',
                      borderRadius: 4,
                      border: '1px solid #d1d5db',
                      fontSize: 14
                    }}
                  />
                  <span style={{ fontWeight: 500 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 16
          }}
        >
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Summary</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 4,
              fontSize: 14
            }}
          >
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
              fontSize: 15,
              fontWeight: 600
            }}
          >
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            className="btn"
            style={{ width: '100%', marginBottom: 8 }}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <button
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;


import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan'
  });

  const navigate = useNavigate();

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStripeCheckout = async () => {
    try {
      setError('');

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setError('Your cart is empty.');
        return;
      }

      
      if (
        !address.fullName.trim() ||
        !address.phone.trim() ||
        !address.street.trim() ||
        !address.city.trim()
      ) {
        setError(
          'Please fill in your name, phone, street address, and city before proceeding.'
        );
        return;
      }

      setLoading(true);

      
      const payloadItems = cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      }));

      const res = await axios.post('/checkout/create-session', {
        items: payloadItems,
        address
      });

      const url = res.data?.url;
      if (!url) {
        setError('Unable to start payment. Please try again.');
        setLoading(false);
        return;
      }

      
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err?.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          'Something went wrong starting Stripe Checkout.'
      );
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="product-section">
        <h2 className="section-title">Checkout</h2>
        <p className="muted-text">Your cart is empty.</p>
        <button className="btn" onClick={() => navigate('/')}>
          Go back to shopping
        </button>
      </div>
    );
  }

  return (
    <div className="product-section">
      <h2 className="section-title">Checkout</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: 24,
          marginBottom: 16,
          alignItems: 'flex-start'
        }}
      >
        {/* Address + Contact form + Order items */}
        <div>
          {/* Address form */}
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Shipping Details</h3>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16
            }}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <div>
                <label
                  htmlFor="fullName"
                  style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={address.fullName}
                  onChange={(e) =>
                    handleAddressChange('fullName', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 4,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
                >
                  Phone *
                </label>
                <input
                  id="phone"
                  type="text"
                  value={address.phone}
                  onChange={(e) =>
                    handleAddressChange('phone', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 4,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="street"
                  style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
                >
                  Street Address *
                </label>
                <input
                  id="street"
                  type="text"
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange('street', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 4,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
                >
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 4,
                    border: '1px solid #d1d5db',
                    fontSize: 14
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 8
                }}
              >
                <div>
                  <label
                    htmlFor="state"
                    style={{
                      display: 'block',
                      fontSize: 13,
                      marginBottom: 4
                    }}
                  >
                    State / Province
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={address.state}
                    onChange={(e) =>
                      handleAddressChange('state', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: 4,
                      border: '1px solid #d1d5db',
                      fontSize: 14
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    style={{
                      display: 'block',
                      fontSize: 13,
                      marginBottom: 4
                    }}
                  >
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={address.postalCode}
                    onChange={(e) =>
                      handleAddressChange('postalCode', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: 4,
                      border: '1px solid #d1d5db',
                      fontSize: 14
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    style={{
                      display: 'block',
                      fontSize: 13,
                      marginBottom: 4
                    }}
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={address.country}
                    onChange={(e) =>
                      handleAddressChange('country', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: 4,
                      border: '1px solid #d1d5db',
                      fontSize: 14
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order items */}
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Order Items</h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: 14
            }}
          >
            {cartItems.map((item) => (
              <li
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #e5e7eb',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div className="muted-text" style={{ fontSize: 12 }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 500 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals + actions */}
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
              marginBottom: 8,
              fontSize: 14
            }}
          >
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
              fontWeight: 600,
              fontSize: 15
            }}
          >
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {error && (
            <div
              style={{
                marginBottom: 8,
                fontSize: 13,
                color: '#b91c1c'
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn"
            style={{ width: '100%', marginBottom: 8 }}
            onClick={handleStripeCheckout}
            disabled={loading}
          >
            {loading ? 'Redirecting to Stripe...' : 'Pay with Card (Stripe)'}
          </button>

          <button
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={handleBackToCart}
          >
            Back to Cart
          </button>

          <button
            className="btn-secondary"
            style={{ width: '100%', marginTop: 8 }}
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

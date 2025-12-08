
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [stripeReceiptUrl, setStripeReceiptUrl] = useState('');
  const [stripeInvoicePdf, setStripeInvoicePdf] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    clearCart();

    const params = new URLSearchParams(location.search);
    const sid = params.get('session_id');
    if (!sid) {
      setError('No Stripe session information found.');
      setLoading(false);
      return;
    }

    setSessionId(sid);

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');


        const res = await axios.get(`/orders/by-session/${sid}`);
        setOrder(res.data);
      } catch (err) {
        console.error(
          'Error fetching order by session:',
          err?.response?.data || err
        );
        setError(
          err?.response?.data?.message ||
            'Could not load the order details for this payment.'
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchStripeLinks = async () => {
      try {
      
        const res = await axios.get(`/checkout/session/${sid}`);
        setStripeReceiptUrl(res.data.receiptUrl || '');
        setStripeInvoicePdf(res.data.invoicePdf || '');
      } catch (err) {
        console.error(
          'Error fetching Stripe receipt/invoice links:',
          err?.response?.data || err
        );
      }
    };

    fetchOrder();
    fetchStripeLinks();
  }, [location.search, clearCart]);

 
  const handleDownloadReceipt = async () => {
    if (!order || !order._id) return;

    try {
      const res = await axios.get(`/orders/${order._id}/receipt`, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `meem-order-${order._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        'Error downloading receipt:',
        err?.response?.data || err.message
      );
      alert('Could not download the receipt. Please try again.');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="product-section">
      <h2 className="section-title">Order Successful</h2>

      {loading ? (
        <p className="muted-text">Loading your order details...</p>
      ) : error ? (
        <>
          <p className="muted-text" style={{ color: '#b91c1c' }}>
            {error}
          </p>
          <button className="btn" onClick={handleGoHome}>
            Back to Home
          </button>
        </>
      ) : !order ? (
        <>
          <p className="muted-text">
            We could not find an order linked to this Stripe session.
          </p>
          <button className="btn" onClick={handleGoHome}>
            Back to Home
          </button>
        </>
      ) : (
        <>
          <p className="muted-text" style={{ marginBottom: 8 }}>
            Thank you! Your payment was processed in Stripe test mode and your
            order has been recorded.
          </p>
          {sessionId && (
            <p className="muted-text" style={{ fontSize: 13, marginBottom: 16 }}>
              Stripe session: <code>{sessionId}</code>
            </p>
          )}

        
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16
            }}
          >
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Order Summary</h3>
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Order ID:</strong> {order._id}
            </p>
            {order.createdAt && (
              <p style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            )}
            <p style={{ fontSize: 13, marginBottom: 4 }}>
              <strong>Status:</strong> {order.status || 'created'}
            </p>
            <p style={{ fontSize: 13, marginBottom: 8 }}>
              <strong>Total:</strong> $
              {Number(order.totalAmount || 0).toFixed(2)}
            </p>

            
            {order.address && (
              <>
                <h4 style={{ fontSize: 15, marginTop: 10, marginBottom: 4 }}>
                  Shipping Details
                </h4>
                <p style={{ fontSize: 13, marginBottom: 2 }}>
                  {order.address.fullName}
                </p>
                <p style={{ fontSize: 13, marginBottom: 2 }}>
                  {order.address.street}
                </p>
                <p style={{ fontSize: 13, marginBottom: 2 }}>
                  {(order.address.city || '') +
                    (order.address.state
                      ? `, ${order.address.state}`
                      : '')}
                </p>
                <p style={{ fontSize: 13, marginBottom: 2 }}>
                  {order.address.country}{' '}
                  {order.address.postalCode
                    ? `(${order.address.postalCode})`
                    : ''}
                </p>
                {order.address.phone && (
                  <p style={{ fontSize: 13, marginBottom: 2 }}>
                    Phone: {order.address.phone}
                  </p>
                )}
              </>
            )}

            
            <h4 style={{ fontSize: 15, marginTop: 10, marginBottom: 4 }}>
              Items
            </h4>
            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: 18,
                margin: 0,
                fontSize: 13
              }}
            >
              {(order.items || []).map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — $
                  {Number(item.price || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>

          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          
            {stripeInvoicePdf ? (
              <a
                className="btn"
                href={stripeInvoicePdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Invoice (Stripe PDF)
              </a>
            ) : stripeReceiptUrl ? (
              <a
                className="btn"
                href={stripeReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Stripe Receipt
              </a>
            ) : (
              <button
                className="btn"
                disabled
                title="Stripe receipt not available yet"
              >
                Stripe receipt not available
              </button>
            )}

            {/* Your own PDF (optional, works via pdfkit route) */}
            <button className="btn-secondary" onClick={handleDownloadReceipt}>
              Download Store Receipt (PDF)
            </button>

            {/* Back home */}
            <button className="btn-secondary" onClick={handleGoHome}>
              Back to Home
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSuccess;

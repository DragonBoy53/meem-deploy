
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const isAdmin = user && user.email === 'admin@meem.com';

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err?.response?.data || err);
        setError(
          err?.response?.data?.message || 'Failed to fetch orders from API.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  const handleMarkFulfilled = async (orderId) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/status`, {
        status: 'fulfilled'
      });

      const updated = res.data;
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    } catch (err) {
      console.error('Error updating order status:', err?.response?.data || err);
      alert(
        err?.response?.data?.message ||
          'Failed to update order status. See console for details.'
      );
    }
  };

  if (!isAdmin) {
    return (
      <div className="product-section">
        <h2 className="section-title">Admin Orders</h2>
        <p className="muted-text">
          Only the admin user can access this page. Please log in with:
        </p>
        <ul className="muted-text" style={{ fontSize: 14 }}>
          <li>Email: <code>admin@meem.com</code></li>
          <li>Password: <code>password@meem</code></li>
        </ul>
        <button className="btn" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="product-section">
      <h2 className="section-title">Admin Orders</h2>

      {loading ? (
        <p className="muted-text">Loading orders...</p>
      ) : error ? (
        <p className="muted-text" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="muted-text">No orders found yet.</p>
      ) : (
        <div
          style={{
            overflowX: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: 8
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13
            }}
          >
            <thead
              style={{
                backgroundColor: '#f3f4f6'
              }}
            >
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={tdStyle}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : '-'}
                  </td>
                  <td style={tdStyle}>
                    {order.address?.fullName || '-'}
                    <br />
                    <span className="muted-text">
                      {order.address?.phone || ''}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {order.address?.street && (
                      <>
                        {order.address.street}
                        <br />
                      </>
                    )}
                    {(order.address?.city || '') +
                      (order.address?.state
                        ? `, ${order.address.state}`
                        : '')}
                    <br />
                    {order.address?.country || ''}
                    {order.address?.postalCode
                      ? ` (${order.address.postalCode})`
                      : ''}
                  </td>
                  <td style={tdStyle}>
                    <ul
                      style={{
                        listStyle: 'disc',
                        margin: 0,
                        paddingLeft: 16
                      }}
                    >
                      {(order.items || []).map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} — $
                          {(item.price || 0).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={tdStyle}>
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 999,
                        fontSize: 12,
                        backgroundColor:
                          order.status === 'fulfilled'
                            ? '#dcfce7'
                            : '#fee2e2',
                        color:
                          order.status === 'fulfilled'
                            ? '#166534'
                            : '#991b1b'
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {order.status === 'fulfilled' ? (
                      <span className="muted-text">Completed</span>
                    ) : (
                      <button
                        className="btn"
                        style={{ padding: '4px 8px', fontSize: 12 }}
                        onClick={() => handleMarkFulfilled(order._id)}
                      >
                        Mark as Fulfilled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '8px 10px',
  textAlign: 'left',
  borderBottom: '1px solid #e5e7eb',
  whiteSpace: 'nowrap'
};

const tdStyle = {
  padding: '8px 10px',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'top'
};

export default AdminOrders;

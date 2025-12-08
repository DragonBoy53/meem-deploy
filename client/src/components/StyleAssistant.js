import React, { useState } from 'react';
import axios from '../axios';

const StyleAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! I am your Meem style assistant. Tell me about the occasion (e.g., wedding, office, casual hangout), and I will suggest an outfit and some items from our store.'
    }
  ]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    // Optimistically show user message
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/recommendations/chat', {
        message: userMessage
      });

      const botText = res.data?.message || 'Sorry, I could not respond.';
      const products = res.data?.products || [];

      setMessages((prev) => [...prev, { from: 'bot', text: botText }]);
      setSuggestedProducts(products);
    } catch (err) {
      console.error(
        'Error talking to style assistant:',
        err.response?.data || err.message
      );
      setError(
        err?.response?.data?.message ||
          'Sorry, I could not connect to the style assistant right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="product-section">
      <h2 className="section-title">Style Assistant</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 800
        }}
      >
        {/* Chat box */}
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 16,
            backgroundColor: '#ffffff',
            maxHeight: 320,
            overflowY: 'auto'
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 8,
                textAlign: m.from === 'user' ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: 16,
                  backgroundColor:
                    m.from === 'user' ? '#111827' : '#f3f4f6',
                  color: m.from === 'user' ? '#f9fafb' : '#111827',
                  fontSize: 14
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              Thinking…
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your occasion or ask what to wear..."
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 8,
              border: '1px solid #d1d5db',
              resize: 'none',
              fontSize: 14
            }}
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button
              className="btn"
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending…' : 'Ask Assistant'}
            </button>
          </div>
          {error && (
            <p className="muted-text" style={{ color: '#b91c1c' }}>
              {error}
            </p>
          )}
        </div>

        {/* Suggested products */}
        {suggestedProducts.length > 0 && (
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>
              Recommended from Meem
            </h3>
            <div
              className="product-grid"
              style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
            >
              {suggestedProducts.map((p) => (
                <div key={p._id} className="product-card">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="product-image"
                  />
                  <h4 className="product-name">{p.name}</h4>
                  <p className="product-price">
                    ${Number(p.price || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleAssistant;

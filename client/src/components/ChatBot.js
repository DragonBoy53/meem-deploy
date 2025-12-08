

import React, { useState } from 'react';
import axios from '../axios';
import ProductCard from './ProductCard';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi, I am Meem Style Assistant. Tell me about your occasion (e.g. winter wedding, job interview, casual hangout) and I will suggest outfits and products from our store.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    
    const newMessages = [
      ...messages,
      { role: 'user', content: trimmed }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await axios.post('/chat', { messages: payloadMessages });

      const replyText = res.data.replyText || '...';
      const recommendedProducts = Array.isArray(res.data.recommendedProducts)
        ? res.data.recommendedProducts
        : [];

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: replyText,
          products: recommendedProducts
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err?.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I could not connect to the style assistant right now. Please try again in a moment.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-section">
      <h2 className="section-title">Meem Style Assistant</h2>
      <p className="muted-text" style={{ marginBottom: 12 }}>
        Ask me what to wear for any occasion – I can also recommend products
        from Meem for you.
      </p>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 12,
          height: '60vh',
          maxHeight: 520,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 4,
            marginBottom: 8
          }}
        >
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  marginBottom: 8
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 10px',
                    borderRadius: 12,
                    backgroundColor: isUser ? '#3b82f6' : '#f3f4f6',
                    color: isUser ? '#ffffff' : '#111827',
                    whiteSpace: 'pre-wrap',
                    fontSize: 14
                  }}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          
          {messages
            .filter((m) => m.role === 'assistant' && m.products?.length)
            .map((m, idx) => (
              <div key={`products-${idx}`} style={{ marginTop: 8 }}>
                <p className="muted-text" style={{ marginBottom: 4 }}>
                  Recommended products:
                </p>
                <div className="product-grid">
                  {m.products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginTop: 4
          }}
        >
          <input
            type="text"
            placeholder="Describe your occasion or style (e.g. winter wedding, job interview)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 4,
              border: '1px solid #d1d5db'
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;

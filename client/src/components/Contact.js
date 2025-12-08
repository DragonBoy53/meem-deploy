
import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    alert('Thank you for reaching out! This is a demo form, so the message is not actually sent.');
  };

  return (
    <div className="product-section">
      <h2 className="section-title">Contact & Location</h2>

      <p className="muted-text" style={{ marginBottom: 16 }}>
        Have a question about Meem, your order, or styling? Reach out using the
        contact details or the form below. You can also find our campus
        location on the map.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
          gap: 24,
          alignItems: 'flex-start'
        }}
      >
        {/* Contact info + form */}
        <div>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>Contact Details</h3>
          <div
            style={{
              fontSize: 14,
              color: '#4b5563',
              marginBottom: 16,
              lineHeight: 1.6
            }}
          >
            <div>
              <strong>Email:</strong> support@meemstore.demo
            </div>
            <div>
              <strong>Phone:</strong> +92 300 0000000
            </div>
            <div>
              <strong>Location:</strong> FAST-NUCES Lahore Campus
              <br />
              Faisal Town, Lahore, Punjab, Pakistan
            </div>
          </div>

          <h3 style={{ fontSize: 20, marginBottom: 8 }}>Send us a message</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label
                htmlFor="name"
                style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: '1px solid #d1d5db',
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: '1px solid #d1d5db',
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label
                htmlFor="message"
                style={{ display: 'block', fontSize: 13, marginBottom: 4 }}
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: '1px solid #d1d5db',
                  fontSize: 14,
                  resize: 'vertical'
                }}
              />
            </div>

            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>Our Location</h3>
          <p className="muted-text" style={{ marginBottom: 8, fontSize: 13 }}>
            The map below is centered around the FAST-NUCES Lahore campus.
          </p>
          <div
            style={{
              width: '100%',
              minHeight: 320,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            <iframe
              title="FAST-NUCES Lahore Location"
              src="https://www.google.com/maps?q=FAST-NUCES%20Lahore&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

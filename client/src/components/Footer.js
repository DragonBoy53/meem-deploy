
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid #e5e7eb',
        marginTop: '32px',
        padding: '16px 24px',
        backgroundColor: '#f9fafb'
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        
        <div style={{ maxWidth: 420 }}>
          <h4 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>
            About Meem
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: '#6b7280',
              lineHeight: 1.5
            }}
          >
            Meem is a modern clothing concept focused on simple, comfortable
            everyday styles for men and women. This demo store was built as a
            university project using React, Node.js, MongoDB, JWT auth, and
            AI-powered recommendations.
          </p>
        </div>

        
        <div>
          <h4 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>
            Quick Links
          </h4>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: 13,
              color: '#374151'
            }}
          >
            <li style={{ marginBottom: 4 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Home
              </Link>
            </li>
            <li style={{ marginBottom: 4 }}>
              <Link
                to="/category/men"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Men&apos;s Collection
              </Link>
            </li>
            <li style={{ marginBottom: 4 }}>
              <Link
                to="/category/women"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Women&apos;s Collection
              </Link>
            </li>
            <li style={{ marginBottom: 4 }}>
              <Link
                to="/assistant"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Style Assistant
              </Link>
            </li>
            <li style={{ marginBottom: 4 }}>
              <Link
                to="/contact"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Contact &amp; Location
              </Link>
            </li>
          </ul>
        </div>

        
        <div>
          <h4 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>Follow</h4>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              fontSize: 13
            }}
          >
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#111827' }}
            >
              Instagram
            </a>
            <span style={{ color: '#d1d5db' }}>|</span>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#111827' }}
            >
              Facebook
            </a>
            <span style={{ color: '#d1d5db' }}>|</span>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#111827' }}
            >
              Twitter / X
            </a>
            <span style={{ color: '#d1d5db' }}>|</span>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#111827' }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1080,
          margin: '12px auto 0',
          fontSize: 12,
          color: '#9ca3af',
          textAlign: 'center'
        }}
      >
        © {new Date().getFullYear()} Meem Store · Demo project
      </div>
    </footer>
  );
};

export default Footer;

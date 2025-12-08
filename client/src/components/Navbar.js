
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const isAdmin = user && user.email === 'admin@meem.com';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            Meem
          </Link>

          <nav className="navbar-links">
            
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
            >
              Home
            </NavLink>

            
            <div className="navbar-dropdown">
              <span className="navbar-link">Men</span>
              <div className="navbar-dropdown-menu">
                <Link to="/category/men" className="navbar-dropdown-item">
                  All Men
                </Link>
                <Link
                  to="/category/men?type=shirts"
                  className="navbar-dropdown-item"
                >
                  Shirts
                </Link>
                <Link
                  to="/category/men?type=pants"
                  className="navbar-dropdown-item"
                >
                  Pants
                </Link>
              </div>
            </div>

            
            <div className="navbar-dropdown">
              <span className="navbar-link">Women</span>
              <div className="navbar-dropdown-menu">
                <Link to="/category/women" className="navbar-dropdown-item">
                  All Women
                </Link>
                <Link
                  to="/category/women?type=dresses"
                  className="navbar-dropdown-item"
                >
                  Dresses
                </Link>
                <Link
                  to="/category/women?type=tops"
                  className="navbar-dropdown-item"
                >
                  Tops
                </Link>
              </div>
            </div>

            
            <NavLink
              to="/assistant"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
            >
              Style Assistant
            </NavLink>

            
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
            >
              Contact
            </NavLink>

            
            {isAdmin && (
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'navbar-link-active' : ''}`
                }
              >
                Admin Orders
              </NavLink>
            )}
          </nav>
        </div>


        <div className="navbar-right">
          
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="navbar-search-input"
            />
          </form>

          
          {user ? (
            <>
              <Link to="/profile" className="navbar-link">
                {user.name || user.email}
              </Link>
              <button
                type="button"
                className="navbar-link navbar-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}

          
          <Link to="/cart" className="navbar-cart">
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="navbar-cart-badge">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

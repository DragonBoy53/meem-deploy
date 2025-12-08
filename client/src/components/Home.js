
import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';

const Home = () => {
  return (
    <div className="home">
      
      <section className="hero">
        <div className="hero-half hero-men">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h2>Men</h2>
            <p>Casual, formal & sportswear for every day.</p>
            <Link to="/category/men" className="btn btn-light">
              Shop Men
            </Link>
          </div>
        </div>

        <div className="hero-half hero-women">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h2>Women</h2>
            <p>New arrivals, essentials & seasonal looks.</p>
            <Link to="/category/women" className="btn btn-light">
              Shop Women
            </Link>
          </div>
        </div>
      </section>

      
      <section className="home-categories">
        <h3 className="section-subtitle">Browse by category</h3>
        <div className="category-grid">
          <Link to="/category/new-in" className="category-card">
            New In
          </Link>
          <Link to="/category/essentials" className="category-card">
            Essentials
          </Link>
          <Link to="/category/winter" className="category-card">
            Winter Collection
          </Link>
          <Link to="/category/all" className="category-card">
            Summer Collection
          </Link>
          <Link to="/category/footwear" className="category-card">
            Footwear
          </Link>
          <Link to="/category/accessories" className="category-card">
            Accessories
          </Link>
        </div>
      </section>

      
      <ProductList title="Featured Products" />
    </div>
  );
};

export default Home;

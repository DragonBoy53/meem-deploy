// client/meem/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ChatBot from './components/ChatBot';
import SearchResults from './components/SearchResults';
import Contact from './components/Contact';
import Footer from './components/Footer';
import OrderSuccess from './components/OrderSuccess';
import AdminOrders from './components/AdminOrders';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-root">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/assistant" element={<ChatBot />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin-only page */}
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart as clearCartAction
} from '../store/cartSlice';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {

  const value = {};
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const dispatch = useDispatch();

  
  const items = useSelector(
    (state) => (state && state.cart && state.cart.items) || []
  );

  const cartItems = items;

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0
  );

  const addToCart = (product) => {
    dispatch(addItem(product));
  };

  const removeFromCart = (productId) => {
    dispatch(removeItem(productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  
  return {
    items: cartItems,
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity: updateCartItemQuantity,
    clearCart
  };
};

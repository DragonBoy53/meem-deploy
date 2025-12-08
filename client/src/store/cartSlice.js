import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const findItemIndex = (items, productId) =>
  items.findIndex((item) => item.productId === productId);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const id = product._id || product.id || product.productId;

      if (!id) return;

      const index = findItemIndex(state.items, id);
      if (index === -1) {
        state.items.push({
          productId: id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        });
      } else {
        state.items[index].quantity += 1;
      }
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.productId !== id);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const index = findItemIndex(state.items, productId);
      if (index !== -1) {
        const newQty = Number(quantity);
        if (newQty <= 0 || Number.isNaN(newQty)) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity = newQty;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

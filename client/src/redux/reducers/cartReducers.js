const initialState = {
  cartItems: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x._id === existingItem._id ? item : x
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x._id !== action.payload),
      };
    default:
      return state;
  }
};

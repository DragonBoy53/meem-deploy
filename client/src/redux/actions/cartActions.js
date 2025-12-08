export const addToCart = (product) => (dispatch) => {
  dispatch({
    type: 'CART_ADD_ITEM',
    payload: product,
  });
};

export const removeFromCart = (productId) => (dispatch) => {
  dispatch({
    type: 'CART_REMOVE_ITEM',
    payload: productId,
  });
};

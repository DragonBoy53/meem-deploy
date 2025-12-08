import { createStore, combineReducers } from 'redux';
import { cartReducer } from './reducers/cartReducers';

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
});

// Create Redux store
const store = createStore(rootReducer);

export default store;

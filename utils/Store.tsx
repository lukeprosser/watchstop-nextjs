import { createContext, useReducer } from 'react';
import { setCookie, getCookie, hasCookie } from 'cookies-next';

const initialState = {
  cart: {
    cartItems: hasCookie('cartItems') ? JSON.parse(getCookie('cartItems')) : [],
  },
};

export const Store = createContext(initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newItem = action.payload;
      console.log('state', state);
      const existingItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map(
            (item) => (item._id === existingItem._id ? existingItem : item) // Ensures consistent state shape
          )
        : [...state.cart.cartItems, newItem];
      setCookie('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
